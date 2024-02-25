require("dotenv").config();

const express = require("express");
const mongoose = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;
const user = require("./routes/user");

app.use(express.json());

app.use("/user", user);

app.get("/", (req, res) => {
  res.send("Serveur Express fonctionne !");
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
