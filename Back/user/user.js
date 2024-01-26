const express = require('express');
const app = express();
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors'); 

app.use(express.json());
app.use(cors());

const jwtSecret = process.env.JWT_SECRET;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: '8889',
    user, 
    password,
    database: 'EpiGoals'
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;
    

    connection.query('SELECT * FROM user WHERE username = ? OR email = ?', [username, username], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Erreur lors de la vérification des informations d\'identification' });
        } else {
            if (results.length > 0) {
                const user = results[0];
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        res.status(500).json({ error: 'Erreur lors de la vérification du mot de passe' });
                    } else if (isMatch) {
                        const token = jwt.sign({ username, role: user.role }, jwtSecret);
                        res.status(200).json({ token, message: 'Vous allez être redirigé' });
                    } else {
                        res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect' });
                    }
                });
            } else {
                res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect' });
            }
        }
    });
});


app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    const passwordCrypt = bcrypt.hashSync(password, 10);

    connection.query('INSERT INTO user (username, email, password) VALUES (?, ?, ?)', [username, email, passwordCrypt], (error, results) => {
        if (error) {
            
            res.status(500).json({ error: 'Erreur lors de l\'enregistrement de l\'utilisateur' });
        } else {
            const token = jwt.sign({ username, role: 'user' }, jwtSecret);
            res.status(200).json({ message: 'Vous avez été Inscrit, Vous allez etre redirigez' });
        }
    });
});

module.exports = app;
