const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  epi: {
    type: Number,
    default: 0,
  },
  mmr: {
    type: Number,
    default: 0,
  },
  victory: {
    type: Number,
    default: 0,
  },
  defeat: {
    type: Number,
    default: 0,
  },
});

teamSchema.path("players").validate(function (value) {
  return value.length === 2;
}, "Une équipe doit avoir exactement 2 joueurs.");

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
