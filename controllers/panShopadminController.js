const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const PanShopRegistered = require("../models/PanshopadminModel")



function validatePassword(password) {
    const minLength = 8; // Minimum length for the password
    const maxLength = 20; // Maximum length for the password
    return password.length >= minLength && password.length <= maxLength;
}




// @desc Register a admin
//@route POST/api/users/register
//@access public


const registerUser = asyncHandler(async (req, resp) => {

    const { username, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        resp.status(400);
        throw new Error("password and confirmPassword are not matched !");
    }
    if (!validatePassword(password)) {
        resp.status(400);
        throw new Error("Password must be between 8 and 20 characters long.");
    }
    if (!username || !email || !password || !confirmPassword) {
        resp.status(400);
        throw new Error("All fields are mandatory !");
    }

    const panShopRegisteredUserAvailable = await PanShopRegistered.findOne({ email });
    if (panShopRegisteredUserAvailable) {
        resp.status(400);
        throw new Error("User already registered !");
    }



    //Hash password;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password", hashedPassword)

    //Hash confirmPassword;

    const hashedCpassword = await bcrypt.hash(confirmPassword, 10);
    console.log("Hashed CPassword", hashedCpassword);


    const panShopRegistered = await PanShopRegistered.create({
        username,
        email,
        password: hashedPassword,
        confirmPassword: hashedCpassword
      
    });
    console.log(`Executive User created ${panShopRegistered}`);
    if (panShopRegistered) {
        resp.status(201).json({ _id: panShopRegistered.id, email: panShopRegistered.email });
    }
    else {
        resp.status(400);
        throw new Error("Executive data us not valid");
    }



    resp.status(200).json({ message: " Register the panShopRegistered" })
});







// @desc Login a user
//@route POST/api/users/login
//@access public

const loginUser = asyncHandler(async (req, resp) => {
    const { email, password } = req.body;

    if (!email || !password) {
        resp.status(400);
        throw new Error("All fields are mandatory !");
    }
    
    const normalizedEmail = email.toLowerCase(); // Convert email to lowercase
    
    const panShopRegistered = await PanShopRegistered.findOne({ email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } });

    //compare password with hashedpassword
    if (panShopRegistered && (await bcrypt.compare(password, panShopRegistered.password))) {
        const accessToken = jwt.sign(
            {
                userExecutive: {
                    username: panShopRegistered.username,
                    email: panShopRegistered.email,
                    id: panShopRegistered.id,
                },
            }, process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: '1500m'
            }
        );
        resp.status(200).json({ accessToken });
    } else {
        resp.status(401);
        throw new Error("Email or password is not valid");
    }

    resp.json({ message: "Login the panShopRegistered" });
});



// @desc current  userinfo
//@route POST/api/users/current
//@access private


const currentUser = asyncHandler(async (req, resp) => {
    resp.json({ message: "Executive current user information" });
});





module.exports = { registerUser, loginUser, currentUser }