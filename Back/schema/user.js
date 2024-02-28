const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  EPI: {
    type: Number,
    default: 0,
  },
  MMR: {
    type: Number,
    default: 0,
  },
  Victory: {
    type: Number,
    default: 0,
  },
  Defeat: {
    type: Number,
    default: 0,
  },
  Role: {
    type: String,
    enum: ["user", "admin", "moderator"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
