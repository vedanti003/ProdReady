

const mongoose = require('mongoose');

// Super Stockist Details Schema
const superStockistDetailsSchema = new mongoose.Schema(
  {
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
       },
    registeredShopName: {
      type: String,
      required: [true, 'Please add the registered shop name'],
      unique: true, // Ensures each shop has a unique name
    },
    location: {
      type: String,
      required: [true, 'Please add the location'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please add the phone number'],
    },
    state: {
      type: String,
      required: [true, 'Please add the state'],
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Export the model
module.exports = mongoose.model('SuperStockistDetails', superStockistDetailsSchema);
