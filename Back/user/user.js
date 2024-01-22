const express = require('express');
const app = express();

app.route('/')
    .get((req, res) => {
        
        res.send('GET request');
    })
    .post((req, res) => {
        res.send('POST request');
    })
    .put((req, res) => {
        res.send('PUT request');
    }
    )

module.exports = app;