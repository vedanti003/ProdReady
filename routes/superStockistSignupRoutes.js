const express = require("express");

const router = express.Router();
const superStockistValidateToken =require("../middleware/superStockistValidateTokenHandler")


const {registerUser,loginUser,currentUser} = require("../controllers/superStockistSignupControllers");




//Register
router.post("/register",registerUser);

//Login

router.post("/login",loginUser);

//Current user information

router.get("/current",superStockistValidateToken,currentUser)

module.exports =router;