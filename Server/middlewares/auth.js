const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// just to check weather the requesting person is a valid user or not
exports.auth = async (req, res, next) => {
  try {
    // all three ways to get token from requests are listed below!
    const token =
      req.body.token ||
      req.cookies.token ||
      req.headers("auth-token").replace("Bearer", "");
    if (!token) {
      console.log("Invalid request!");
      return res.status(400).json({
        success: false,
        message: "Invalid request!",
      });
    }

    // once the token is found! then verify the token and fetch the user from the token!
    try {
      const data = jwt.verify(token, process.env.JWT_SECRET);
      // *************
      req.user = data;
      // *************
    } catch (error) {
      console.log("Token is invalid!");
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
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
