const mongoose = require('mongoose');

const asyncHandler = require('express-async-handler');

const adminSalesSchema = new mongoose.Schema({
   
  email_Id: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  order_qty: {
    type: Number,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  ProductName: {
    type: String,
    required: true
  },
  price_per_unit: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  }
});

const adminSales = mongoose.model('adminSales', adminSalesSchema);

module.exports = adminSales;
