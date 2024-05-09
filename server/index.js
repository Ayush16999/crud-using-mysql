require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');
const mysql = require('mysql');
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Ayush@123",
    database: "vahan_assignment"
})


//middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173']
}));
app.use(express.json())
app.use(express.query())
//middleware


app.listen(9000, async () => {
    console.log(`Server started at port: 9000`);
});

app.get('/', (req, res) => {
 res.json(`Welcome to backend`);
});

