const express = require("express");
const router = express.Router();

// Import the correct function from the controllers
const { capturePayment, verifySignature } = require("../controllers/Payment");

const auth = require("../controllers/Auth");
const isStudent = require("../controllers/Auth");

// router.post("/capturePayment", auth, isStudent, capturePayment);
// router.post("/verifySignature", auth, verifySignature); // Ensure 'auth' middleware is applied if needed

module.exports = router;

// router.get(
//     '/webhook',
//     (req, res) => {
//         console.log("Webhook hit");
//         // Verify the event type is check.session.completed
//         if (!req.body.event || req.body.event.type !== 'checkout.session.completed') {
//             return res.status(400).send({ error: 'unknown event type' });
//         }

//         // Parse the session from the event
//         let session;
//         try {
//             session = JSON.parse(req.body.event.data.object);
