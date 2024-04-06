const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const { mailSender } = require("../utils/nodeMailer");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const otpTemplate = require("../mail/templates/emailVerificationTemplate");
require("dotenv").config();
const jwt = require("jsonwebtoken");

//*********************************************************************************************************************************************
//*                                                     send OTP for email verification
//**********************************************************************************************************************************************
//? hits when user submits the signup page
exports.sendOTP = async (req, res) => {
  console.log("backend sendOTP called!");
  try {
    // fetch email from req body
    const { email } = req.body;
    // console.log(email);
    // check weather user exist in User collection
    let checkUserPresent = await User.findOne({ email });

    // if user with the given email already exists!! return response that user exist
    // checkUserPresent = null
    // console.log("backend sendOTP called! and found user", checkUserPresent);

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already Registered",
      });
    }
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    // console.log("generated otp: ", otp);

    // check weather thr otp is unique! if not generate new one

    let result = await OTP.findOne({ otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp });
    }
    const otpPayload = { email, otp };
    // console.log(otpPayload);
    const otpBody = await OTP.create(otpPayload);
    // console.log("otpBody", otpBody);
    try {
      const emailResponse = await mailSender(
        otpPayload.email,
        "OTP  Verification Mail",
        otpTemplate(otpPayload.otp)
      );
      console.log("Email sent successfully: ", emailResponse.response);
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent on your email",
      otp,
      otpBody,
    });
  } catch (error) {
    console.log("error in sending otp Auth.js", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//*********************************************************************************************************************************************
//*                                                     Sign-up
//**********************************************************************************************************************************************

//? hits when the correct otp is entered at the verify-email page 
//? verify email page gets signup data from the redux store as the data is already stored there by signup using setSignupData reducer
exports.signup = async (req, res) => {
  // console.log('at the backend signup api');
  // fetch all the info from req
  try {
    const {
      email,
      firstName,
      lastName,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;
    // console.log('Otp at the backend signup api is :',otp)

    // validate each of them
    console.log(
      email,
      firstName,
      lastName,
      password,
      confirmPassword,
      accountType,
      // contactNumber,
      otp
    );
    if (
      !email ||
      !firstName ||
      !lastName ||
      !password ||
      !confirmPassword ||
      !accountType ||
      // !contactNumber ||
      !otp
    ) {
      return res
        .status(403)
        .json({ success: false, message: "All fields are required" });
    }

    // verify both the passwords
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirmPassword must be same!:",
      });
    }
    const existingUser = await User.findOne({ email });
    // console.log(existingUser);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already registered!",
      });
    }
    // find the most recent otp from the OTP collection for the specified email
    const recentOTP = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    if (recentOTP.length === 0) {
      //   // OTP not found for the email

      return res.status(400).json({
        success: false,
        message: "OTP not found!",
      });
    } else if (recentOTP[0].otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP!",
      });
    }

    // hashing the password

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    let approved = "";
    approved === "Instructor" ? (approved = false) : (approved = true);

    // initiating the user personal details with null values
    // that means that instance fot the profile details is made at this stage using null values
    // next time we just have to update this values instead of creating new instance
    const ProfileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });
    // create user i.e. save user details to database

    const user = await User.create({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      accountType,
      contactNumber,
      additionalDetails: ProfileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    return res.status(200).json({
      success: true,
      message: "User registered successfully!",
      user,
    });
  } catch (error) {
    console.log("error in user Sign-in Auth.js", error.message);
    res.status(500).json({
      success: false,
      message: "user can not be registered! try again",
    });
  }
};

//*********************************************************************************************************************************************
//*                                                     Log-in
//**********************************************************************************************************************************************

exports.login = async (req, res) => {
  try {
    // get data from req.body
    const { email, password } = req.body;

    // validate data
    if (!email || !password) {
      res.status(403).json({
        success: false,
        message: "All the fields are required",
      });
    }
    // check weather user exists or not!
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Sorry! user with this email dose not exist! please sign-up",
      });
    }
    // match pass with the database pass
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      //generate JWT after password matching
      const token = await jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
      user.token = token;
      user.password = undefined;

      // create cookie and send response
      const options = {
        expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.status(200).cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged-in successfully!",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      });
    }
  } catch (error) {
    console.log("error in login Auth.js", error.message);
    res.status(500).json({
      success: false,
      message: "Login failed! please try again!",
    });
  }
};

//*********************************************************************************************************************************************
//*                                                     Change-Password
//**********************************************************************************************************************************************

exports.changePassword = async (req, res) => {
  try {
    // getting user id from the req.body
    const userId = req.user.id;
    // find the user with the id present in req.body
    const user = await User.findById({ _id: userId });
    console.log(userId);
    // get updated details from req.body
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide all fields.",
      });
    }

    // check weather the old pass and pass present in the db are same using bcrypt
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" });
    }
    // validate both new and confirm pass
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "The new password and confirm password do not match.",
      });
    }
    // hash the new password using bcrypt
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    // update the user's password
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      {
        //! ------------------- there may be an issue with this -------------------
        $set: { password: encryptedPassword },
      },
      { new: true }
    );
    try {
      const emailResponse = await mailSender(
        updatedUser.email,
        "this is header",
        passwordUpdated(
          updatedUser.email,
          "Password Updated Successfully",
          `${updatedUser.firstName} ${updatedUser.lastName}`
        )
      );
      console.log("Email sent successfully: ", emailResponse.response);
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};
