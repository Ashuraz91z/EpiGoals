require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const user = require("./routes/user");
const match = require("./routes/match");
const mongoose = require("./db");
const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.static("public"));

app.use("/user", user);
app.use("/match", match);

app.get("/", (req, res) => {
  res.send("Serveur Express fonctionne !");
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
