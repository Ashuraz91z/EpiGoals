const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../schema/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(express.json());

function verifyToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).send("Un token est requis pour l'authentification");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Token invalide ou expiré");
  }

  if (
    req.user.role === "admin" ||
    req.user.role === "user" ||
    req.params.id === req.user._id.toString()
  ) {
    next();
  } else {
    console.log(req.user);
    return res.status(403).send("Accès refusé.");
  }
}

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const newUser = await user.save();

    res.status(201).send({ userId: newUser._id });
  } catch (error) {
    console.log(error);
    res.status(500).send("Erreur lors de la création de l'utilisateur.");
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send("L'email n'existe pas.");
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).send("Mot de passe incorrect.");
    }

    const token = jwt.sign(
      { _id: user._id, role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.send({ token });
  } catch (error) {
    res.status(500).send("Erreur serveur.");
  }
});

router.delete("/delete", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send("Utilisateur introuvable.");
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).send("Mot de passe incorrect.");
    }

    await User.findByIdAndDelete(req.user._id);

    res.send("supprimé avec succès.");
  } catch (error) {
    res.status(500).send("Erreur lors de la suppression de l'utilisateur.");
  }
});

router.put("/update", verifyToken, async (req, res) => {
  const { oldPassword, newPassword, ...updateData } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send("Utilisateur introuvable.");
    }

    if (newPassword && oldPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).send("L'ancien mot de passe est incorrect.");
      }
      updateData.password = await bcrypt.hash(newPassword, 10);
    } else if (newPassword) {
      return res
        .status(400)
        .send("L'ancien mot de passe est requis pour changer de mot de passe.");
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
    }).select("-password");

    res.json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send("Erreur lors de la mise à jour de l'utilisateur.");
  }
});

module.exports = router;
