const asyncHandler = require('express-async-handler');
const SuperStockistProduct = require('../models/superStockistProductDetailsModel');

// @desc Get all products for a user
// @route GET /api/superstockistproducts
// @access Private
const getSuperStockistProducts = asyncHandler(async (req, res) => {
  const products = await SuperStockistProduct.find({ user_id:req.userExecutive.id});
  res.status(200).json(products);
});

// @desc Get a single product by ID
// @route GET /api/superstockistproducts/:id
// @access Private
const getSuperStockistProduct = asyncHandler(async (req, res) => {
  const product = await SuperStockistProduct.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Ensure the user has permission to access this product
  if (product.user_id.toString() !== req.userExecutive.id) {
    res.status(403);
    throw new Error("User doesn't have permission to access this product");
  }

  res.status(200).json(product);
});

// @desc Create a new super stockist product
// @route POST /api/superstockistproducts
// @access Private
const createSuperStockistProduct = asyncHandler(async (req, res) => {
  const { productName, productDescription, flavour, productSize, price, quantity } = req.body;

  if (!productName || !productDescription || !flavour || !productSize || !price || !quantity) {
    res.status(400);
    throw new Error('All fields are mandatory');
  }

  const newProduct = await SuperStockistProduct.create({
    user_id: req.userExecutive.id,
    productName,
    productDescription,
    flavour,
    productSize,
    price,
    quantity,
  });

  res.status(201).json(newProduct);
});

// @desc Update a super stockist product
// @route PUT /api/superstockistproducts/:id
// @access Private
const updateSuperStockistProduct = asyncHandler(async (req, res) => {
  const product = await SuperStockistProduct.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Ensure the user has permission to update this product
  if (product.user_id.toString() !== req.userExecutive.id) {
    res.status(403);
    throw new Error("User doesn't have permission to update this product");
  }

  const updatedProduct = await SuperStockistProduct.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true } // Return the updated product
  );

  res.status(200).json(updatedProduct);
});

// @desc Delete a super stockist product
// @route DELETE /api/superstockistproducts/:id
// @access Private
const deleteSuperStockistProduct = asyncHandler(async (req, res) => {
  const product = await SuperStockistProduct.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Ensure the user has permission to delete this product
  if (product.user_id.toString() !== req.userExecutive.id) {
    res.status(403);
    throw new Error("User doesn't have permission to delete this product");
  }

  await SuperStockistProduct.deleteOne({ _id: req.params.id });

  res.status(200).json({ message: 'Product deleted successfully' });
});

module.exports = {
  getSuperStockistProducts,
  getSuperStockistProduct,
  createSuperStockistProduct,
  updateSuperStockistProduct,
  deleteSuperStockistProduct,
};
