const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// just to check weather the requesting person is a valid user or not
exports.auth = async (req, res, next) => {
  try {
    // all three ways to get token from requests are listed below!
    // console.log(
    //   "TOKEN At auth.js for change password (Server/middlewares/auth.js)",
    //   req.body.token
    // );

    // console.log(req.headers("authorization").replace("Bearer", ""));

    const token =
      req.body.token || 
      //? had problem with the line given below
      //? make sure that you are passing token exactly with the same name as given below from the frontend
      req.header("Authorization").replace("Bearer ", "");

    // console.log(token)
    //? req.headers() line was causing the error
    // req.headers("auth-token").replace("Bearer", "");
    // console.log("token at auth is: ",token)
    if (!token) {
      console.log("Invalid request!");
      return res.status(400).json({
        success: false,
        message: "Invalid request!",
      });
    }

    // console.log("token at the server/controllers/course.js",req.body.token)
    // once the token is found! then verify the token and fetch the user from the token!
    try {
      const data = jwt.verify(token, process.env.JWT_SECRET);
      if (!data) {
        return res.status(400).json({ msg: "no data found!" });
      }
      // console.log("found data of user", data)
      // console.log(data)
      const email = data?.email;
      const user = await User.findOne({ email });
      // console.log(user);
      // *************
      req.user = data;
      // *************
    } catch (error) {
      console.log("Token is invalid!");
      return res.status(401).json({
        success: false,
        message: "Invalid Token" + error,
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

// isStudent!!!!!!

exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(400).json({
        success: false,
        message: "This is a protected route for student only!",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};

// isInstructor!!!!!!

exports.isInstructor = async (req, res, next) => {
  try {
    // console.log(req.user.accountType)
    if (req.user.accountType !== "Instructor") {
      return res.status(400).json({
        success: false,
        message: "This is a protected route for Instructor only!",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};

// isAdmin!!!!!!

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(400).json({
        success: false,
        message: "This is a protected route for Admin only!",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};
