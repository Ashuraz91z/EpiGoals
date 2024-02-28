const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  equipe1: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  equipe2: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  winner: {
    type: String,
    enum: ["equipe1", "equipe2"],
    required: true,
  },
  scoreEquipe1: {
    type: Number,
    required: true,
  },
  scoreEquipe2: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Match = mongoose.model("Match", matchSchema);

module.exports = Match;
