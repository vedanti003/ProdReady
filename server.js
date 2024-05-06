const express = require("express");
const errorHandler = require("./middleware/errorhandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const cors = require("cors");
const path = require("path");
const { fileURLToPath } = require("url");

// Resolving dirname from CommonJS
const __filenameCommonJS = __filename;
const __dirnameCommonJS = path.dirname(__filenameCommonJS);
console.log(__dirnameCommonJS);

connectDb(); // calls from config/dbConnection file

const app = express();

app.use(cors());

const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/contacts", require("./routes/contactRouters"));
app.use("/api/administrators", require("./routes/administratorRoutes"));
app.use("/api/panshopadmin", require("./routes/panShopadminRoutes"));
app.use("/api/forgetPassword", require("./routes/authRoutes"));
app.use("/api/resetPassword", require("./routes/authRoutes"));

// Use the client app
app.use(express.static(path.join(__dirnameCommonJS, "/client/build")));

//Render
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirnameCommonJS, "/client/build/index.html"))
);

// SuperStockist Signup
app.use("/api/superstockist", require("./routes/superStockistSignupRoutes"));
app.use(
  "/api/superStockistDetails",
  require("./routes/superStockistDetailsRoutes")
);
app.use(
  "/api/superStockistProductDetails",
  require("./routes/superStockistProductDetailsRoutes")
);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port no ${port}`);
});
