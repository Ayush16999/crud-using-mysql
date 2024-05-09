require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');

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

app.get('/api', (req, res) => {
    return res.send(`<p>Hello, This is the united mega race API page</p>`);
});

