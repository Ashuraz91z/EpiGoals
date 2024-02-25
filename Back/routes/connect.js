const express = require("express");
const router = express.Router();

// Exemple de route
router.get("/", (req, res) => {
  res.send("Oauth2.0 - Prêt à être utilisé !");
});

module.exports = router; // Assurez-vous que cette ligne est présente
