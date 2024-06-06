const express = require("express");
const router = express.Router();

// Import the correct function from the controllers
const { capturePayment, verifySignature } = require("../controllers/Payment");

const auth = require("../controllers/Auth");
const isStudent = require("../controllers/Auth");

// router.post("/capturePayment", auth, isStudent, capturePayment);
// router.post("/verifySignature", auth, verifySignature); // Ensure 'auth' middleware is applied if needed


module.exports = router;