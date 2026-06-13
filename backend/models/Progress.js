const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  completedLessons: [String]
});

module.exports = mongoose.model(
  "Progress",
  ProgressSchema
);