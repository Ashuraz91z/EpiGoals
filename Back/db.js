const mongoose = require("mongoose");

const dbURI = process.env.DB_URI;

mongoose
  .connect(dbURI)
  .then(() => console.log("Connexion à MongoDB Atlas réussie."))
  .catch((err) => console.error("Erreur de connexion à MongoDB Atlas:", err));

module.exports = mongoose;
