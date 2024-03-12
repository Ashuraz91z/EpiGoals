const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../schema/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Match = require("../schema/match");

require("dotenv").config();

const app = express();

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  secureConnection: true,
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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
    if (
      !req.body.username ||
      !req.body.email ||
      !req.body.password ||
      !req.body.confirm
    ) {
      return res
        .status(400)
        .send(
          "Veuillez fournir un nom d'utilisateur, un email et un mot de passe."
        );
    }

    if (req.body.password.length < 8 || typeof req.body.password !== "string") {
      return res
        .status(400)
        .send("Le mot de passe doit contenir au moins 8  caractères.");
    }

    if (req.body.username.length < 4 || typeof req.body.username !== "string") {
      return res
        .status(400)
        .send("Le nom d'utilisateur doit contenir au moins 4 caractères.");
    }

    if (req.body.username.length > 20) {
      return res
        .status(400)
        .send("Le nom d'utilisateur doit contenir moins de 20 caractères.");
    }

    if (req.body.password !== req.body.confirm) {
      return res.status(400).send("Les mots de passe ne correspondent pas.");
    }

    if (req.body.check !== true) {
      return res
        .status(400)
        .send("Vous devez accepter les conditions d'utilisation.");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const newUser = await user.save();

    res.status(201).send({ userId: newUser._id });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send("L'email ou le mot de passe existe déjà.");
    }
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

router.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const resetURL = `http://localhost:3000/reset-password?token=${resetToken}`; //url mot de passe oublié

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Réinitialisation de votre mot de passe",
    html: `<p>Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant : <a href="${resetURL}">${resetURL}</a></p>`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res
        .status(500)
        .send({ message: "Erreur lors de l'envoi de l'email", error });
    }
    res
      .status(200)
      .send({ message: "Email de réinitialisation envoyé avec succès", info });
  });
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);
    console.log(decoded.email);

    if (Date.now() <= decoded.exp * 1000) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.findOneAndUpdate(
        { email: decoded.email },
        { password: hashedPassword }
      );
      res.status(200).send("Mot de passe réinitialisé avec succès.");
    } else {
      res.status(401).send("Token expiré.");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Token invalide.");
  }
});

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).send("Token non fourni.");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      // Vérifie si l'erreur est due à un token expiré
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Token expiré. Veuillez vous reconnecter." });
      }
      // Pour les autres erreurs de vérification du token
      return res.status(403).json({ message: "Token invalide." });
    }

    const authenticatedUser = await User.findById(user._id);
    if (!authenticatedUser) {
      return res.status(404).send("Utilisateur non trouvé.");
    }

    req.user = authenticatedUser;
    next();
  });
};
router.get("/notif", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    const matchs = await Match.find({
      $or: [{ equipe1: userId }, { equipe2: userId }],
      estConfirmé: false,
    })
      .populate({ path: "equipe1", select: "username" })
      .populate({ path: "equipe2", select: "username" });

    res.json(matchs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la récupération des matchs.");
  }
});

module.exports = router;
