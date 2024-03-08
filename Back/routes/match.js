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

// router.post("/record", async (req, res) => {
//   try {
//     const { equipe1, equipe2, scoreEquipe1, scoreEquipe2 } = req.body;

//     // Recherche des joueurs par username dans les bases de données pour les équipes 1 et 2
//     const equipe1Joueurs = await User.find({ username: { $in: equipe1 } });
//     const equipe2Joueurs = await User.find({ username: { $in: equipe2 } });

//     // Calcul du MMR moyen pour chaque équipe
//     const MMRMoyenEquipe1 =
//       equipe1Joueurs.reduce((acc, joueur) => acc + joueur.MMR, 0) /
//       equipe1Joueurs.length;
//     const MMRMoyenEquipe2 =
//       equipe2Joueurs.reduce((acc, joueur) => acc + joueur.MMR, 0) /
//       equipe2Joueurs.length;

//     // Calcul de la probabilité de victoire pour chaque équipe
//     let probaEquipe1 =
//       1 / (1 + Math.pow(10, (MMRMoyenEquipe2 - MMRMoyenEquipe1) / 2000));
//     let probaEquipe2 =
//       1 / (1 + Math.pow(10, (MMRMoyenEquipe1 - MMRMoyenEquipe2) / 2000));

//     // Détermination du gagnant et du perdant basée sur les scores
//     let winner, loser;
//     if (scoreEquipe1 > scoreEquipe2) {
//       winner = equipe1;
//       loser = equipe2;
//     } else {
//       winner = equipe2;
//       loser = equipe1;
//     }

//     // Fonction pour ajuster l'EPI et le MMR
//     const ajusterStats = (joueur, estGagnant, equipeAdverseMMRMoyen) => {
//       const differenceMMR = joueur.MMR - equipeAdverseMMRMoyen;
//       const baseEPIAjustement = estGagnant ? 20 : -20; // Base ajustement EPI
//       const ajustementEPI =
//         baseEPIAjustement * Math.exp(-Math.abs(differenceMMR) / 400); // Ajustement EPI exponentiel
//       joueur.EPI += ajustementEPI;

//       const MMRafter =
//         joueur.MMR +
//         (estGagnant ? 1 : -1) *
//           50 *
//           (1 + Math.abs(scoreEquipe1 - scoreEquipe2) * 0.05); // Simplification pour l'exemple
//       joueur.MMR = MMRafter;

//       if (estGagnant) {
//         joueur.Victory += 1;
//       } else {
//         joueur.Defeat += 1;
//       }

//       return joueur.save();
//     };

//     // Ajuster les stats pour chaque joueur des deux équipes
//     await Promise.all(
//       equipe1Joueurs.map((joueur) =>
//         ajusterStats(joueur, winner === equipe1, MMRMoyenEquipe2)
//       )
//     );
//     await Promise.all(
//       equipe2Joueurs.map((joueur) =>
//         ajusterStats(joueur, winner === equipe2, MMRMoyenEquipe1)
//       )
//     );

//     res.status(200).json("MMR et EPI ajustés.");
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Erreur lors de l'enregistrement du match.",
//       error: error.message,
//     });
//   }
// });

async function updateMatchStats(
  matchId,
  equipe1Ids,
  equipe2Ids,
  scoreEquipe1,
  scoreEquipe2
) {
  try {
    const equipe1Joueurs = await User.find({ _id: { $in: equipe1Ids } });
    const equipe2Joueurs = await User.find({ _id: { $in: equipe2Ids } });
    const estEquipe1Gagnante = scoreEquipe1 > scoreEquipe2;

    const ajusterStats = async (joueur, estGagnant) => {
      joueur.MMR += estGagnant ? 30 : -20; // a modifier en fonciton de la difference de MMR
      joueur.EPI += estGagnant ? 15 : -10; // a modifier car reste inchnage si on gagne ou perd et exponentiel en fonction de la difference de MMR et de EPi
      estGagnant ? joueur.Victory++ : joueur.Defeat++;
      await joueur.save();
    };

    await Promise.all(
      equipe1Joueurs.map((joueur) => ajusterStats(joueur, estEquipe1Gagnante))
    );
    await Promise.all(
      equipe2Joueurs.map((joueur) => ajusterStats(joueur, !estEquipe1Gagnante))
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
