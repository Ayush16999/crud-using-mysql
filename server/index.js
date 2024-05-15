require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    port: process.env.DATABASE_PORT,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})



app.use(cors({
    origin: ['http://localhost:5173']
}));
app.use(express.json())
app.use(express.query())


app.listen(9000, async () => {
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


// Add a row to a specific table endpoint
app.post('/api/tables/:tableName/add', (req, res) => {
    const { tableName } = req.params;
    const newRow = req.body;
    console.log((newRow));
    const columns = Object.keys(newRow).map(col => `\`${col}\``).join(', ');
    const values = Object.values(newRow).map(value => `'${value}'`).join(', ');

    const query = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${values})`;

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



app.get('/api/tables/:tableName', (req, res) => {
    const { tableName } = req.params;
    const query = `SELECT * FROM ${tableName}`;
    db.query(query, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});


app.post('/employees', (req, res) => {
    const query = "INSERT INTO vahan_assignment.employees (`name`, `phone`, `email`, `dob`, `desc`, `department` ) VALUES (?)"
    const values = ["Alone Clone", "743425435", "alone123@gmail.com", "2000/09/02", "Hello guys i am under the water", "Developers"]

    db.query(query, [values], (err, result) => {
        if (err) return res.json(err)
        return res.json({ message: "New Row Created Successfully" })
    })

});



app.get('/', (req, res) => {
    res.json(`Welcome to backend`);
});
