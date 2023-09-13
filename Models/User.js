// Import mongoose
const mongoose = require('mongoose');

// Create a user schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String
});

// Create a User model from the schema
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;
