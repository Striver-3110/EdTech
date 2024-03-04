// require('dotenv').config();
const BASE_URL = process.env.REACT_APP_BASE_URL;

console.log(BASE_URL);

export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendOTP",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/resetPasswordToken",
  RESETPASSWORD_API: BASE_URL + "/auth/changePassword",
};
export const categories = {
  CATEGORIES_API: BASE_URL + "/course/categoryPageDetails",
};

export const contactUsEndpoint = {
  CONTACT_US_API : BASE_URL + 'reach/contact'
}