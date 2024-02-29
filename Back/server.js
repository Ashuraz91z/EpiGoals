require("dotenv").config();

const express = require("express");
const mongoose = require("./db");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;
const user = require("./routes/user");
const match = require("./routes/Match");

app.use(express.json());
app.use(express.static("public"));

app.use("/user", user);
app.use("/match", match);

io.on("connection", (socket) => {
  console.log("Un utilisateur s'est connecté");

  socket.on("disconnect", () => {
    console.log("Un utilisateur s'est déconnecté");
  });
});

app.get("/", (req, res) => {
  res.send("Serveur Express fonctionne !");
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
