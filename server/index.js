require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');
const mysql = require('mysql2');
const serverless = require('serverless-http');

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


db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});




app.post('/api/createTable', (req, res) => {
    const { tableName, columns } = req.body;

    let createQuery = `CREATE TABLE ${tableName} (`;
    columns.forEach((column, index) => {
        const { name, dataType, primaryKey, autoIncrement, defaultValue } = column;
        createQuery += `${name} ${dataType}`;
        if (primaryKey) {
            createQuery += ' PRIMARY KEY';
            if (autoIncrement) {
                createQuery += ' AUTO_INCREMENT';
            }
        }
        if (defaultValue) {
            createQuery += ` DEFAULT ${defaultValue}`;
        }
        createQuery += index !== columns.length - 1 ? ', ' : '';
    });
    createQuery += ')';

    db.query(createQuery, (err, result) => {
        if (err) {
            console.error('Error creating table:', err);
            return res.status(500).json({ error: 'Failed to create table' });
        }
        return res.status(201).json({ message: 'Table created successfully' });
    });
});



app.get('/api/employees', (req, res) => {
    const data = "SELECT * FROM vahan_assignment.employees"
    db.query(data, (err, items) => {
        if (err) return res.json(err)
        return res.json(items)
    })
});


app.post('/api/employees', (req, res) => {
    const query = "INSERT INTO vahan_assignment.employees (`name`, `phone`, `email`, `dob`, `desc`, `department` ) VALUES (?)"
    const values = ["Alone Clone", "743425435", "alone123@gmail.com", "2000/09/02", "Hello guys i am under the water", "Developers"]

    db.query(query, [values], (err, result) => {
        if (err) return res.json(err)
        return res.json({ message: "New Row Created Successfully" })
    })

});


app.get('/api', (req, res) => {
    res.json(`Welcome to backend`);
});



module.exports.handler = serverless(app);