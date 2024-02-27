const express = require('express');
const router = express.Router();
const {
    signup,
    login,
    sendOTP,
    changePassword,
} = require('../controllers/Auth');
const { auth } = require('../middlewares/auth');
const {
    resetPasswordToken,
    resetPassword
} = require('../controllers/ResetPassword');

router.post('/login', login);
router.post('/signup', signup);
router.post('/sendOTP', sendOTP);
router.post('/changePassword', auth, changePassword);

router.post('/resetPasswordToken', resetPasswordToken);
router.post("/resetPassword", resetPassword);

module.exports = router;
