const express = require("express");
const router = express.Router();
const User = require("../schema/user");
const Match = require("../schema/match");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
require("dotenv").config();
const jwt = require("jsonwebtoken");

const coeffMMR = 30;

router.get("/", async (req, res) => {
  try {
    const matches = await Match.find();
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/pre-record-match", async (req, res) => {
  const { equipe1, equipe2, scoreEquipe1, scoreEquipe2 } = req.body;

  const equipe1Ids = await User.find({ username: { $in: equipe1 } }).select(
    "_id"
  );
  const equipe2Ids = await User.find({ username: { $in: equipe2 } }).select(
    "_id"
  );

  try {
    const nouveauMatch = new Match({
      equipe1: equipe1Ids.map((doc) => doc._id),
      equipe2: equipe2Ids.map((doc) => doc._id),
      scoreEquipe1,
      scoreEquipe2,
    });

    await nouveauMatch.save();

    res.status(201).json({
      message:
        "Match pré-enregistré avec succès. En attente de confirmation des joueurs.",
      matchId: nouveauMatch._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors du pré-enregistrement du match.");
  }
});

async function updateMatchStats(
  matchId,
  equipe1Ids,
  equipe2Ids,
  scoreEquipe1,
  scoreEquipe2,
  baseMMR = 30
) {
  try {
    const equipe1Joueurs = await User.find({ _id: { $in: equipe1Ids } });
    const equipe2Joueurs = await User.find({ _id: { $in: equipe2Ids } });
    const MMREquipe1Moyen =
      equipe1Joueurs.reduce((acc, joueur) => acc + joueur.MMR, 0) /
      equipe1Joueurs.length;
    const MMREquipe2Moyen =
      equipe2Joueurs.reduce((acc, joueur) => acc + joueur.MMR, 0) /
      equipe2Joueurs.length;

    const calculerProbabiliteVictoire = (MMREquipeJoueur, MMREquipeAdverse) => {
      return (
        1 / (1 + Math.pow(10, (MMREquipeAdverse - MMREquipeJoueur) / 2000))
      );
    };

    const calculerAjustementMMR = (
      MMRJoueur,
      estGagnant,
      probaVictoire,
      scoreEquipeJoueur,
      scoreEquipeAdverse
    ) => {
      const resultatMatch = estGagnant ? 1 : 0; // 1 pour victoire, 0 pour défaite
      const differenceScore = estGagnant
        ? scoreEquipeJoueur - scoreEquipeAdverse
        : scoreEquipeAdverse - scoreEquipeJoueur;
      return Math.round(
        MMRJoueur +
          baseMMR *
            2 *
            (resultatMatch - probaVictoire) *
            (1 + differenceScore * 0.05)
      );
    };

    const calculerAjustementEPI = (EPIJoueur, MMRJoueur, estGagnant) => {
      const baseEPI = 10;
      const maxPerteEPI = 30;
      const cibleEPI = MMRJoueur / 2;
      const differenceEPI = cibleEPI - EPIJoueur;
      let ajustement;

      if (estGagnant) {
        ajustement = baseEPI + 5 + Math.abs(differenceEPI) / 10;
        ajustement = Math.min(ajustement, baseEPI * 3); //prend le plus petit
      } else {
        ajustement = -baseEPI - Math.abs(differenceEPI) / 20;
        ajustement = Math.max(ajustement, -maxPerteEPI); //prend le plus grand
      }

      let EPIAjuste = Math.round(EPIJoueur + ajustement);

      return EPIAjuste;
    };

    const ajusterStats = async (
      joueur,
      estEquipe1Gagnante,
      equipeAdverseMMRMoyen
    ) => {
      const probaVictoire = calculerProbabiliteVictoire(
        joueur.MMR,
        equipeAdverseMMRMoyen
      );
      joueur.MMR = calculerAjustementMMR(
        joueur.MMR,
        estEquipe1Gagnante,
        probaVictoire,
        scoreEquipe1,
        scoreEquipe2
      );
      joueur.EPI = calculerAjustementEPI(
        joueur.EPI,
        joueur.MMR,
        estEquipe1Gagnante
      );
      estEquipe1Gagnante ? joueur.Victory++ : joueur.Defeat++;
      await joueur.save();
    };

    await Promise.all(
      equipe1Joueurs.map((joueur) =>
        ajusterStats(joueur, scoreEquipe1 > scoreEquipe2, MMREquipe2Moyen)
      )
    );
    await Promise.all(
      equipe2Joueurs.map((joueur) =>
        ajusterStats(joueur, scoreEquipe2 > scoreEquipe1, MMREquipe1Moyen)
      )
    );
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour des statistiques des matchs:",
      error
    );
  }
}

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).send("Token non fourni.");

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Token expiré. Veuillez vous reconnecter." });
      }
      return res.status(403).json({ message: "Token invalide." });
    }

    const authenticatedUser = await User.findById(user._id);
    if (!authenticatedUser)
      return res.status(404).send("Utilisateur non trouvé.");

    req.user = authenticatedUser;
    next();
  });
};

router.post("/confirm/:matchId", authenticateToken, async (req, res) => {
  const { matchId } = req.params;
  const userId = req.user._id.toString();

  try {
    const match = await Match.findById(matchId);
    if (!match) return res.status(404).send("Match non trouvé.");

    const isPlayerInMatch =
      match.equipe1.includes(userId) || match.equipe2.includes(userId);
    if (!isPlayerInMatch)
      return res.status(403).send("Vous n'êtes pas un joueur de ce match.");

    if (match.confirmations.includes(userId))
      return res.status(400).send("Vous avez déjà confirmé ce match.");

    match.confirmations.push(userId);
    await match.save();

    if (match.confirmations.length >= 3 && !match.estConfirmé) {
      match.estConfirmé = true;
      await match.save();
      await updateMatchStats(
        matchId,
        match.equipe1,
        match.equipe2,
        match.scoreEquipe1,
        match.scoreEquipe2
      );
    }

    res.json({ message: "Confirmation enregistrée", match });
  } catch (error) {
    res.status(500).send("Erreur lors de la confirmation du match.");
  }
});

module.exports = router;
