const mongoose = require("mongoose");
const generateToken = require("../services/jwtService")


// Define a schema (blueprint of user data)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});


// Create and export the model
module.exports = mongoose.model("User", userSchema);
