const asyncHandler = require("express-async-handler");
const SuperStockistDetails = require("../models/superStockistDetailsModel");

// @desc Get all super stockist details
// @route GET /api/superstockistdetails
// @access private
const getSuperStockistDetails = asyncHandler(async (req, res) => {
  const stockists = await SuperStockistDetails.find({ user_id: req.userExecutive.id  });
  res.status(200).json(stockists);
});

// @desc Get a single super stockist detail
// @route GET /api/superstockistdetails/:id
// @access private
const getSuperStockistDetail = asyncHandler(async (req, res) => {
  const stockist = await SuperStockistDetails.findById(req.params.id);
  if (!stockist) {
    res.status(404);
    throw new Error("Super stockist detail not found");
  }

  // Ensure the user has permission to access this detail
  if (stockist.user_id.toString() !== req.userExecutive.id) {
    res.status(403);
    throw new Error("User doesn't have permission to access this detail");
  }

  res.status(200).json(stockist);
});

// @desc Create a new super stockist detail
// @route POST /api/superstockistdetails
// @access private
const createSuperStockistDetail = asyncHandler(async (req, res) => {
  const { registeredShopName, location, phoneNumber, state } = req.body;

  if (!registeredShopName || !location || !phoneNumber || !state) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const newStockist = await SuperStockistDetails.create({
    user_id: req.userExecutive.id,
    registeredShopName,
    location,
    phoneNumber,
    state,
  });

  res.status(201).json(newStockist);
});

// @desc Update a super stockist detail
// @route PUT /api/superstockistdetails/:id
// @access private
const updateSuperStockistDetail = asyncHandler(async (req, res) => {
  const stockist = await SuperStockistDetails.findById(req.params.id);
  if (!stockist) {
    res.status(404);
    throw new Error("Super stockist detail not found");
  }

  // Ensure the user has permission to update this detail
  if (stockist.user_id.toString() !== req.userExecutive.id) {
    res.status(403);
    throw new Error("User doesn't have permission to update this detail");
  }

  const updatedStockist = await SuperStockistDetails.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedStockist);
});

// @desc Delete a super stockist detail
// @route DELETE /api/superstockistdetails/:id
// @access private
const deleteSuperStockistDetail = asyncHandler(async (req, res) => {
  const stockist = await SuperStockistDetails.findById(req.params.id);
  if (!stockist) {
    res.status(404);
    throw new Error("Super stockist detail not found");
  }

  // Ensure the user has permission to delete this detail
  if (stockist.user_id.toString() !== req.userExecutive.id) {
    res.status(403);
    throw new Error("User doesn't have permission to delete this detail");
  }

  await SuperStockistDetails.deleteOne({ _id: req.params.id });

  res.status(200).json({ message: "Super stockist detail deleted" });
});

module.exports = {
  getSuperStockistDetails,
  getSuperStockistDetail,
  createSuperStockistDetail,
  updateSuperStockistDetail,
  deleteSuperStockistDetail,
};
