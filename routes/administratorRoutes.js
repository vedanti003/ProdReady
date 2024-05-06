const express = require("express");
const router = express.Router();
const {registerUser,loginUser,currentUser} = require("../controllers/administratorController");
const validateToken = require("../middleware/validateTokenHandler");

// Register
router.post("/register", registerUser);

//Login
router.post("/login",loginUser);

    // Current user information

    router.get("/current",validateToken, currentUser);


        module.exports = router