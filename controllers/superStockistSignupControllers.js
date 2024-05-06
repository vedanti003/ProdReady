const asyncHandler = require("express-async-handler");
const SuperStockistRegistered = require("../models/superStockistSignupModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")




function validatePassword(password) {
    const minLength = 8; // Minimum length for the password
    const maxLength = 20; // Maximum length for the password
    return password.length >= minLength && password.length <= maxLength;
}


// @desc Register a admin
//@route POST/api/users/register
//@access public


const registerUser = asyncHandler(async(req ,resp)=>{

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

const superStockistSignupAvailable =await SuperStockistRegistered.findOne({email});

if(superStockistSignupAvailable)
{
    resp.status(400);
    throw new Error("User already registered !");
}
//Hash password;
const hashedPassword = await bcrypt.hash(password, 10);
console.log("Hashed Password", hashedPassword)

//Hash confirmPassword;

const hashedCpassword = await bcrypt.hash(confirmPassword, 10);
console.log("Hashed CPassword", hashedCpassword);


const superStockistRegistered = await SuperStockistRegistered.create({
    username,
    email,
    password: hashedPassword,
    confirmPassword: hashedCpassword
  
});
console.log(`Executive User created ${superStockistRegistered}`);
if (superStockistRegistered) {
    resp.status(201).json({ _id: superStockistRegistered.id, email: superStockistRegistered.email });
}
else {
    resp.status(400);
    throw new Error("superStockistRegistered data us not valid");
}



resp.status(200).json({ message: " Register the superStockistRegistered" })


})



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
    
    const superStockistRegistered = await SuperStockistRegistered.findOne({ email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } });

    //compare password with hashedpassword
    if (superStockistRegistered && (await bcrypt.compare(password, superStockistRegistered.password))) {
        const accessToken = jwt.sign(
            {
                userExecutive: {
                    username: superStockistRegistered.username,
                    email: superStockistRegistered.email,
                    id: superStockistRegistered.id,
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

    resp.json({ message: "Login the superStockistRegistered" });
});



// @desc current  userinfo
//@route POST/api/users/current
//@access private


const currentUser = asyncHandler(async (req, resp) => {
    resp.json({ message: "superStockistRegistered current user information" });
});





module.exports = { registerUser, loginUser, currentUser }