require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const util = require('util');

const app = express();
const port = process.env.PORT || 9000;

// Database Connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    port: process.env.DATABASE_PORT,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// File Uploads Directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'https://scrap-builder.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Get column definitions for a specific table
app.get('/api/tables/:tableName/columns', (req, res) => {
    const { tableName } = req.params;
    const query = `
        SELECT COLUMN_NAME, DATA_TYPE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = ?
    `;
    db.query(query, [tableName], (err, results) => {
        if (err) {
            console.error('Error fetching column definitions:', err);
            return res.status(500).json({ message: 'Failed to fetch column definitions' });
        }
        res.json(results);
    });
});

// Add row to a specific table
app.post('/api/tables/:tableName/add', upload.any(), (req, res) => {
    const { tableName } = req.params;
    const newRow = req.body;
    console.log('Request received for table:', tableName);
    console.log('Request body:', newRow);
    console.log('Files:', req.files);

    req.files.forEach(file => {
        newRow[file.fieldname] = file.path;
    });

    const columns = Object.keys(newRow).map(col => `\`${col}\``).join(', ');
    const values = Object.values(newRow).map(value => `'${value}'`).join(', ');

    const query = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${values})`;
    console.log('Constructed query:', query);

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error adding row to table:', err);
            return res.status(500).json({
                message: 'Failed to add row to table',
                error: err.message,
                stack: err.stack
            });
        }
        console.log('Row added successfully:', result);
        res.json({ message: 'Row added successfully', result });
    });
});

// Create table
app.post('/api/createTable', (req, res) => {
    const { tableName, columns } = req.body;
    console.log(tableName, columns);

    const columnsSql = columns.map(column => {
        const defaultValueSql = column.defaultValue ? `DEFAULT '${column.defaultValue}'` : '';
        return `${column.name} ${column.dataType} ${defaultValueSql}`;
    }).join(', ');

    const createTableSql = `
        CREATE TABLE ?? (
            _id INT AUTO_INCREMENT PRIMARY KEY,
            ${columnsSql}
        )
    `;

    db.query(createTableSql, [tableName], (err, result) => {
        if (err) {
            console.error('Error creating table:', err);
            return res.status(500).json({ error: 'Error creating table' });
        }
        res.status(201).json({ message: 'Table created successfully' });
    });
});

// Get all tables
app.get('/api/tables', (req, res) => {
    const query = "SHOW TABLES";
    db.query(query, (err, tables) => {
        if (err) return res.status(500).json(err);
        return res.json(tables);
    });
});

// Delete table
app.delete('/api/tables/:tableName', (req, res) => {
    const { tableName } = req.params;
    const query = `DROP TABLE ??`;
    db.query(query, [tableName], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: `Table ${tableName} deleted successfully` });
    });
});

// Update table name
app.put('/api/tables/update', (req, res) => {
    const { oldName, newName } = req.body;
    if (!oldName || !newName) {
        return res.status(400).json({ error: 'Missing oldName or newName in request body' });
    }
    const query = `ALTER TABLE ?? RENAME TO ??`;
    db.query(query, [oldName, newName], (err, result) => {
        if (err) {
            console.error('Error updating table name:', err);
            return res.status(500).json({ error: 'Error updating table name' });
        }
        return res.json({ message: `Table name updated from ${oldName} to ${newName}` });
    });
});

// Get data from table
app.get('/api/tables/:tableName', (req, res) => {
    const { tableName } = req.params;
    const columnQuery = `SHOW COLUMNS FROM ??`;
    db.query(columnQuery, [tableName], (err, columns) => {
        if (err) return res.status(500).json(err);

        const dataQuery = `SELECT * FROM ??`;
        db.query(dataQuery, [tableName], (err, data) => {
            if (err) return res.status(500).json(err);

            const transformedData = data.map(row => {
                columns.forEach(col => {
                    if (col.Type.includes('blob') && row[col.Field]) {
                        row[col.Field] = row[col.Field].toString('utf-8'); // Convert buffer to string
                        row[col.Field] = path.join('/uploads', row[col.Field].slice(7)); // Create URL
                    }
                });
                return row;
            });
            return res.json(transformedData);
        });
    });
});

app.get('/', (req, res) => {
    res.json('Welcome to backend');
});

app.listen(port, () => {
    console.log(`Server started at port: ${port}`);
});

module.exports = app;
