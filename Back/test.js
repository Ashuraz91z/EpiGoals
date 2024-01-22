const express = require('express');
const mysql = require('mysql');
const router = express.Router();

// Créer une connexion à la base de données
const connection = mysql.createConnection({
  host: 'localhost',
  port: '8889',
  user: 'root', 
  password: 'root',
  database: 'EpiGoals'
});

// Ouvrir la connexion à la base de données
connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données: ' + err.stack);
    return;
  }
  console.log('Connecté à la base de données avec l\'ID ' + connection.threadId);
});

// Route pour tester la connexion à la base de données
router.get('/', (req, res) => {
  connection.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
    if (error) {
      res.status(500).send('Erreur lors de la connexion à la base de données: ' + error);
    } else {
      res.send('Connexion à la base de données réussie, résultat de 1 + 1 = ' + results[0].solution);
    }
  });
});

module.exports = router;
