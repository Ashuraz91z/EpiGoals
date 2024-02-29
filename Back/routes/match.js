const express = require("express");
const router = express.Router();
const User = require("../schema/user");
const Match = require("../schema/match");
const app = express();
app.use(express.json());

const coeffMMR = 30;

router.get("/", async (req, res) => {
  try {
    const matches = await Match.find();
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// router.post("/pre-record-match", async (req, res) => {
//   const { equipe1, equipe2, scoreEquipe1, scoreEquipe2 } = req.body;
//   const io = require("socket.io")(server);

//   const equipe1Ids = await User.find({ username: { $in: equipe1 } }).select(
//     "_id"
//   );
//   const equipe2Ids = await User.find({ username: { $in: equipe2 } }).select(
//     "_id"
//   );

//   try {
//     const nouveauMatch = new Match({
//       equipe1: equipe1Ids.map((doc) => doc._id),
//       equipe2: equipe2Ids.map((doc) => doc._id),
//       scoreEquipe1,
//       scoreEquipe2,
//       // Ne pas définir `winner` ici puisque le match n'est pas encore confirmé
//     });

//     await nouveauMatch.save();

//     // Envoyer une notification aux joueurs des deux équipes pour confirmer leur participation
//     io.emit("notification-match", {
//       message:
//         "Un nouveau match a été pré-enregistré. Veuillez confirmer votre participation.",
//       matchId: nouveauMatch._id,
//     });

//     res.status(201).json({
//       message:
//         "Match pré-enregistré avec succès. En attente de confirmation des joueurs.",
//       matchId: nouveauMatch._id,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Erreur lors du pré-enregistrement du match.");
//   }
// });

// router.post("/record", async (req, res) => {
//   try {
//     const { equipe1, equipe2, scoreEquipe1, scoreEquipe2 } = req.body;

//     const equipe1Joueurs = await User.find({ username: { $in: equipe1 } });
//     const equipe2Joueurs = await User.find({ username: { $in: equipe2 } });

//     const MMRMoyenEquipe1 =
//       equipe1Joueurs.reduce((acc, joueur) => acc + joueur.MMR, 0) /
//       equipe1Joueurs.length;
//     const MMRMoyenEquipe2 =
//       equipe2Joueurs.reduce((acc, joueur) => acc + joueur.MMR, 0) /
//       equipe2Joueurs.length;

//     let probaEquipe1 =
//       1 / (1 + Math.pow(10, (MMRMoyenEquipe2 - MMRMoyenEquipe1) / 2000));
//     let probaEquipe2 =
//       1 / (1 + Math.pow(10, (MMRMoyenEquipe1 - MMRMoyenEquipe2) / 2000));

//     let winner;
//     let loser;
//     if (scoreEquipe1 > scoreEquipe2) {
//       winner = equipe1;
//       loser = equipe2;
//     } else {
//       winner = equipe2;
//       loser = equipe1;
//     }

//     equipe1Joueurs.forEach((joueur) => {
//       const MMRactuel = joueur.MMR;
//       const MMRafter =
//         MMRactuel +
//         coeffMMR *
//           2 *
//           ((winner === equipe1 ? 1 : 0) - probaEquipe1) *
//           (1 + Math.abs(scoreEquipe1 - scoreEquipe2) * 0.05);

//       joueur.MMR = MMRafter;
//       if (winner === equipe1) {
//         joueur.Victory = joueur.Victory + 1;
//       } else {
//         joueur.Defeat = joueur.Defeat + 1;
//       }
//       joueur.save();
//     });

//     equipe2Joueurs.forEach((joueur) => {
//       const MMRactuel = joueur.MMR;
//       const MMRafter =
//         MMRactuel +
//         coeffMMR *
//           2 *
//           ((winner === equipe2 ? 1 : 0) - probaEquipe2) *
//           (1 + Math.abs(scoreEquipe2 - scoreEquipe1) * 0.05);

//       joueur.MMR = MMRafter;

//       if (winner === equipe2) {
//         joueur.Victory = joueur.Victory + 1;
//       } else {
//         joueur.Defeat = joueur.Defeat + 1;
//       }

//       joueur.save();
//     });
//     res.status(200).json("MMR modifié");
//   } catch (error) {
//     res.status(401).json(error);
//   }
// });

module.exports = router;
