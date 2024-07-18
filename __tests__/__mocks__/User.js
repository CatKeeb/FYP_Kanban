const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  firstName: String,
  lastName: String,
  image: String,
  password: String,
});

module.exports = mongoose.model("User", userSchema);
