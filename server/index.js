require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2');
const util = require('util');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    port: process.env.DATABASE_PORT,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Destination directory
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); // Generate unique filename
    }
});

const upload = multer({ storage: storage });

const exec = util.promisify(require('child_process').exec);



//middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'https://scrap-builder.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
}));
app.use(express.json())
app.use(express.query())
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const port = process.env.PORT || 9000;

app.listen(port, async () => {
    console.log(`Server started at port: 9000`);
});


db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});


// Endpoint to get column definitions for a specific table
app.get('/api/tables/:tableName/columns', (req, res) => {
    const { tableName } = req.params;

    const query = `
      SELECT COLUMN_NAME, DATA_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = '${tableName}'
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching column definitions:', err);
            return res.status(500).json({ message: 'Failed to fetch column definitions' });
        }
        res.json(results);
    });
});


app.post('/api/tables/:tableName/add', upload.any(), (req, res) => {
    const { tableName } = req.params;
    const newRow = req.body;

    // Handle file fields
    req.files.forEach(file => {
        newRow[file.fieldname] = file.path;
    });

    const columns = Object.keys(newRow).map(col => `\`${col}\``).join(', ');
    const values = Object.values(newRow).map(value => `'${value}'`).join(', ');

    const query = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${values})`;

    console.log(query);

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error adding row to table:', err);
            return res.status(500).json({ message: 'Failed to add row to table' });
        }
        res.json({ message: 'Row added successfully' });
    });
});


// Create table endpoint
app.post('/api/createTable', (req, res) => {
    const { tableName, columns } = req.body;

    console.log(tableName, columns);

    // Construct columns SQL with default value
    const columnsSql = columns.map(column => {
        const defaultValueSql = column.defaultValue ? `DEFAULT '${column.defaultValue}'` : '';
        return `${column.name} ${column.dataType} ${defaultValueSql}`;
    }).join(', ');

    // Add id column with primary key and auto increment
    const createTableSql = `
        CREATE TABLE ${tableName} (
            _id INT AUTO_INCREMENT PRIMARY KEY,
            ${columnsSql}
        )
    `;

    db.query(createTableSql, (err, result) => {
        if (err) {
            console.error('Error creating table:', err);
            return res.status(500).json({ error: 'Error creating table' });
        }
        res.status(201).json({ message: 'Table created successfully' });
    });
});


// Get all tables endpoint
app.get('/api/tables', (req, res) => {
    const query = "SHOW TABLES";
    db.query(query, (err, tables) => {
        if (err) return res.status(500).json(err);
        return res.json(tables);
    });
});



// Delete table endpoint
app.delete('/api/tables/:tableName', (req, res) => {
    const { tableName } = req.params;
    const query = `DROP TABLE ??`; // Use parameterized query to avoid SQL injection
    db.query(query, [tableName], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: `Table ${tableName} deleted successfully` });
    });
});



// Update table name endpoint
app.put('/api/tables/update', async (req, res) => {
    const { oldName, newName } = req.body;
    if (!oldName || !newName) {
        return res.status(400).json({ error: 'Missing oldName or newName in request body' });
    }

    try {
        const query = `ALTER TABLE \`${oldName}\` RENAME TO \`${newName}\``;
        db.query(query);
        return res.json({ message: `Table name updated from ${oldName} to ${newName}` });
    } catch (error) {
        console.error('Error updating table name:', error);
        return res.status(500).json({ error: 'Error updating table name' });
    }
});



app.get('/api/tables/:tableName', (req, res) => {
    const { tableName } = req.params;

    // Query to get column types
    const columnQuery = `SHOW COLUMNS FROM ${tableName}`;

    db.query(columnQuery, (err, columns) => {
        if (err) return res.status(500).json(err);

        // Fetching the actual data from the table
        const dataQuery = `SELECT * FROM ${tableName}`;
        db.query(dataQuery, (err, data) => {
            if (err) return res.status(500).json(err);

            // Transform the BLOB fields to URLs
            const transformedData = data.map(row => {
                columns.forEach(col => {
                    if (col.Type.includes('blob')) {
                        if (row[col.Field]) {
                            row[col.Field] = row[col.Field].toString('utf-8'); // Convert buffer to string
                            row[col.Field] = path.join('/uploads', row[col.Field].slice(7)); // Create URL
                        }
                    }
                });
                return row;
            });

            return res.json(transformedData);
        });
    });
});



app.get('/', (req, res) => {
    res.json(`Welcome to backend`);
});



module.exports = app;