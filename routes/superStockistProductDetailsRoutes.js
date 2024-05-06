const express = require("express");
const router = express.Router();
const {
  getSuperStockistProducts,
  getSuperStockistProduct,
  createSuperStockistProduct,
  updateSuperStockistProduct,
  deleteSuperStockistProduct,
} = require("../controllers/superstockistProductController");
const validateToken = require("../middleware/superStockistValidateTokenHandler"); // Middleware for authentication

// Apply authentication middleware to all routes
router.use(validateToken);

// Route to get all products for the current user or to create a new product
router.route("/")
  .get(getSuperStockistProducts) // GET /api/superstockistproducts
  .post(createSuperStockistProduct); // POST /api/superstockistproducts

// Route to get, update, or delete a specific product by ID
router.route("/:id")
  .get(getSuperStockistProduct) // GET /api/superstockistproducts/:id
  .put(updateSuperStockistProduct) // PUT /api/superstockistproducts/:id
  .delete(deleteSuperStockistProduct); // DELETE /api/superstockistproducts/:id

module.exports = router;
