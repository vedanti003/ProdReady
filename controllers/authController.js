const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');
const Executives = require('../models/PanshopadminModel');
const crypto = require('crypto');
const randomstring = require('randomstring');

// Generate and store reset token
const generateResetToken = async (email) => {
    const user = await Executives.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour

    // Store reset token in the user document
    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;
    await user.save();

    return resetToken;
};

// Send password reset email
const sendResetEmail = async (name, email, resetToken) => {
    let testAccount = await nodemailer.createTestAccount();

    // Create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // Use true for port 465, false for all other ports
        auth: {
            user: 'zackary43@ethereal.email',
            pass: 'SQRugxYEz27scJHUy9'
        }
    });

    // Send password reset email
    await transporter.sendMail({
        from: '"Attica 👻" <atticapanmasala@ethereal.email>',
        to: email,
        subject: 'Password Reset Request',
        text: `Hello ${name},\n\nYou are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n`
            + `Please click on the following link, or paste this into your browser to complete the process:\n\n`
            + `http://localhost:5001/api/resetPassword/${resetToken}\n\n`
            + `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    });
};

const forgetPassword = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;

        
        const userData = await Executives.findOne({ email });

        if (userData) {
            // Generate a random token
            const randomToken = randomstring.generate();

            // Update the user document with the new token
            const updateResult = await Executives.updateOne({ email }, { $set: { resetToken: randomToken } });

            // Log the update result
            console.log(updateResult);

            // Send the password reset email
            await sendResetEmail(userData.name, userData.email, randomToken);

            // Respond with success message
            res.status(200).send({ success: true, msg: "Please check your email and reset the password" });
        } else {
            // If user doesn't exist, respond with error message
            res.status(404).send({ success: false, msg: "The email does not exist" });
        }
    } catch (error) {
        // Handle any errors that occur during the process
        console.error(error);
        res.status(500).send({ success: false, msg: "Internal server error" });
    }
});

const resetPassword = async (req, res) => {
    try {
        const resetToken = req.params.resetToken;
        const tokendata = await Executives.findOne({ resetToken });
        console.log(tokendata);
        if (tokendata) {
            const password = req.body.password;
            const newPassword = await securePassword(password);
            const ExecutivesData = await Executives.findByIdAndUpdate(
                tokendata._id,
                { $set: { password: newPassword, confirmPassword: newPassword, resetToken: '' }},
                { new: true }
            );
            console.log(ExecutivesData);
            res.status(200).send({
                success: true,
                msg: "User Password has been reset",
                data: ExecutivesData
            });
        } else {
            res.status(404).send({
                success: false,
                msg: "This link has been expired"
            });
        }
    } catch (error) {
        res.status(400).send({
            success: false,
            msg: "An error occurred while resetting the password"
        });
    }
};

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        // In case of an error in hashing the password, send an appropriate error response
        throw new Error(error.message);
    }
};

module.exports = { forgetPassword, resetPassword };