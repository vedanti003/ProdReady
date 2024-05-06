const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Super Stockist Schema for user registration
const superStockistSignupSchema = new mongoose.Schema(
  {
 
    username: {
      type: String,
      required: [true, 'Please add the user name'],
      minlength: 3, // Ensure a minimum length for usernames
    },
    email: {
      type: String,
      required: [true, 'Please add the user email address'],
      unique: [true, 'Email address already taken'],
      lowercase: true, // Normalize email to lowercase
      match: [/.+@.+\..+/, 'Please enter a valid email address'], // Basic email validation
    },
    password: {
      type: String,
      required: [true, 'Please add the user password'],
    },
    resetToken: String,
    resetTokenExpiration: Date,
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);


// Export the model with a proper name
module.exports = mongoose.model('SuperStockistRegistered', superStockistSignupSchema);
