const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const Administrator = require("../models/administratorModel")


// @desc Register a admin
//@route POST/api/users/register
//@access public


const registerUser = asyncHandler(async (req, resp) => {

    const { username, email, password, confirmPassword } = req.body;
    if(password !== confirmPassword )
    {
        resp.status(400);
        throw new Error("password and confirmPassword are not matched !");
      }

    if (!username || !email || !password || !confirmPassword) {
        resp.status(400);
        throw new Error("All fields are mandatory !");
    }

    const administratorUserAvailable = await Administrator.findOne({ email });
    if (administratorUserAvailable) {
        resp.status(400);
        throw new Error("User already registered !");
    }



    //Hash password;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password", hashedPassword)
//console.log
    //Hash confirmPassword;

    const hashedCpassword = await bcrypt.hash(confirmPassword, 10);
    console.log("Hashed CPassword", hashedCpassword);

 
    const administrator = await Administrator.create({
        username,
        email,
        password: hashedPassword,
        confirmPassword: hashedCpassword
    });
    console.log(`Administrator User created ${administrator}`);
    if (administrator) {
        resp.status(201).json({ _id: administrator.id, email: administrator.email });
    }
    else {
        resp.status(400);
        throw new Error("administrator data us not valid");
    }



    resp.status(200).json({ message: " Register the administrator" })
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

    const administrator = await Administrator.findOne({ email });
    //compare password with hashedpassword
    if (administrator && (await bcrypt.compare(password,administrator.password)))
    {
        const accessToken = jwt.sign(
            {

            userAdministrator:{
                username:administrator.username,
                email:administrator.email,
                id: administrator.id,

            },
        },process.env.ACCESS_TOKEN_SECRET,
         {
expiresIn: "15m"  }
        );

        resp.status(200).json({accessToken});
    }
    else{
        resp.status(401);
        throw new Error("email or password is not valid")
    }

        resp.json({ message: "login the admin" });
});


// @desc current  userinfo
//@route POST/api/users/current
//@access private


const currentUser = asyncHandler(async (req, resp) => {
    resp.json(req.userAdministrator);
});


module.exports = { registerUser, loginUser, currentUser }