const mongoose = require("mongoose");
const mailSender = require("../utils/nodeMailer.js");
const emailVerificationTemplate = require('../mail/templates/emailVerificationTemplate.js')


const OTP = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    // ! the time is in sec or ms??
    expires: 5 * 60,// the document in mongodb will automatically be deleted after 5 minutes
  },
});

// a function to send mail

const sendEmailWithOTP = async (email, otp) => {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification email from StudyNotion",
      emailVerificationTemplate(otp)
    );
    console.log(mailResponse);
  } catch (error) {
    console.log("error in sending mail in OTP.js line 22-26:", error);
  }
};


OTP.pre("save", async (next) => {

  
  // Only send an email when a new document is created
  if (this.isNew) {
    await sendEmailWithOTP(this.email, this.otp);
  }
  next();
});

module.exports = mongoose.model("OTP", OTP);
