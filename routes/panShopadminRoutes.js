const express = require ("express");
const router = express.Router();
const {registerUser,loginUser,currentUser}= require("../controllers/panShopadminController");
const executiveValidateToken = require("../middleware/executiveValidateTokenHandler");


//Register
router.post("/registerdeliveryboy",registerUser);

//Login

router.post("/logindeliveryboy",loginUser);

//Current user information

router.get("/currentexecutive",executiveValidateToken,currentUser)

module.exports =router;