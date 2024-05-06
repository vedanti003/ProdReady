const express = require('express');
const router = express.Router();
const { forgetPassword ,resetPassword} = require('../controllers/authController');

router.route('/').post(forgetPassword);
 
router.route('/:resetToken').put(resetPassword);

module.exports = router;