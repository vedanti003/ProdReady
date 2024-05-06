const express = require("express");
const router = express.Router();
const {
  getSuperStockistDetails,
  createSuperStockistDetail,
  getSuperStockistDetail,
  updateSuperStockistDetail,
  deleteSuperStockistDetail,
} = require("../controllers/superStockistDetailsController");
const superStockistValidateToken = require("../middleware/superStockistValidateTokenHandler"); // Authentication middleware

// Apply authentication middleware to all routes
router.use(superStockistValidateToken);

// Define routes for CRUD operations on Super Stockist Details
router.route("/").get(getSuperStockistDetails); // Get all details for the current user
router.route("/").post(createSuperStockistDetail); // Create a new super stockist detail
router.route("/:id").get(getSuperStockistDetail); // Get a specific super stockist detail by ID
router.route("/:id").put(updateSuperStockistDetail); // Update a specific super stockist detail
router.route("/:id").delete(deleteSuperStockistDetail); // Delete a specific super stockist detail

module.exports = router;
