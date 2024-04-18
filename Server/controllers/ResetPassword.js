const User = require("../models/User");
const bcrypt = require("bcrypt");
const { mailSender } = require("../utils/nodeMailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

//? backend code to send the email for reset password with token
exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const user = await User.findOne({ email });
    // console.log(user)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "sorry! user with this email not found",
      });
    }
    //generate token and save it to the database
    // const token = crypto.randomBytes(20).toString("hex");
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "60m",
    });

    // const token = crypto.randomUUID();

    // update user details
    const date = Date.now();
    console.log(date);

    const details = await User.findOneAndUpdate(
      { email },
      {
        token: token,
        // resetPasswordExpires: date + 60 * 60 * 1000,
      },
      { new: true }
    );
    console.log("details", details);
    // generate url with the help of token
    const url = `http://localhost:3000/update-password/${token}`;

    // send the email with the link generated from token
    await mailSender(
      email,
      "Link to reset password of your StudyNotion account!",
      //!!!! use template
      `Link : ${url}`
    );

    // if success! send response

    return res.status(200).json({
      success: true,
      message: "link has been sent on your email",
    });
  } catch (err) {
    console.log(
      "error in reset password token generation , please try again later!"
    );
    res.status(500).json({
      success: false,
      message:
        "something went wrong while sending reset password mail, please try again",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;
    // console.log(req.body);
    const user = await User.findOne({ token });
    // console.log(user);
    // console.log("comparing times", Date.now(), user.resetPasswordExpires);
    if (!user) {
      console.log("Invalid token");
      return res.status(400).json({
        success: false,
        message: "Token expired!!",
      });
    }
    // if (user.resetPasswordExpires < Date.now()) {
    //   console.log("Sorry! token has expired!");
    //   return res.status(400).json({
    //     success: false,
    //     message: "Token has expired! please try again!",
    //   });
    // }
    if (password !== confirmPassword) {
      // check for password & confirmPassword match
      console.log("Passwords do not match!");
      return res.status(400).json({
        success: false,
        message: "Your Password and Confirm Password does not match",
      });
    }
    // hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    // update the new password to the user table
    await User.findOneAndUpdate(
      { token: token },
      {
        password: hashedPassword,
        // token: null,
        resetPasswordExpires: Date.now(),
      },
      { new: true }
    );
    await mailSender(
      user.email,
      "Password changed",
      //!!!! use template
      `password changed successfully!!`
    );
    return res.json({
      success: true,
      message: `Password Reset Successful`,
    });
  } catch (error) {
    console.log("error in resetting the password!");
    res.status(500).json({
      success: false,
      message: "Error occurred while resetting your password" + error,
    });
  }
};
