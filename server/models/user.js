// server/models/User.js
const mongoose = require("mongoose");

// Define schema for user registration
const userSchema = new mongoose.Schema({
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, required: true, enum: ["HouseOwner", "Customer"] },
});

// Create model based on the schema
const User = mongoose.model("User", userSchema);

module.exports = User;
