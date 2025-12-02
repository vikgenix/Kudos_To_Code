const mongoose = require("mongoose");
const generateToken = require("../services/jwtService")


// Define a schema (blueprint of user data)
const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  leetcodeUsername: { type: String },
  codeforcesUsername: { type: String },
  completedProblems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
  }],
});


// Create and export the model
module.exports = mongoose.model("User", userSchema);
