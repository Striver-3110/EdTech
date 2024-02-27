const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const {
  getAllUserDetails,
  updateProfile,
  deleteAccount,
  updateDisplayPicture,
  getEnrolledCourses,
} = require("../controllers/Profile");

router.put("/updateProfile", auth, updateProfile);
router.get("/getUserDetails", auth, getAllUserDetails);
router.delete("/deleteProfile", auth, deleteAccount);
router.post("/updateDisplayPicture", auth, updateDisplayPicture);

//! if the user is student , then only he/she should see all the enrolled courses rather just a user!!!
router.get("/getEnrolledCourses", auth, getEnrolledCourses);

module.exports = router;