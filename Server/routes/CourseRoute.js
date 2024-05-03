const express = require("express");
const router = express.Router();

const {
  createCourse,
  showAllCourses,
  getCourseDetails,
  editCourse,
  // getInstructorCourses
} = require("../controllers/Course");

const {
  createCategory,
  showAllCategories,
  categoryPageDetails,
} = require("../controllers/Category");

const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/SubSection");

const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReviews");

const {
  auth,
  isAdmin,
  isStudent,
  isInstructor,
} = require("../middlewares/auth");

//********************************************************************************************************************* */
//**                                    Course Routes
//********************************************************************************************************************* */

router.post("/createCourse", auth, isInstructor, createCourse); // route tested
router.get("/getAllCourses", showAllCourses); // route tested
router.get("/getInstructorCourses",auth,isInstructor, getInstructorCourses); // route tested


router.get("/getCourseDetails", getCourseDetails); // route tested
router.post('/editCourse',auth,isInstructor,editCourse)

//********************************************************************************************************************* */
//**                                    Section Routes
//********************************************************************************************************************* */
router.post("/createSection", auth, isInstructor, createSection); // route tested
router.put("/updateSection", auth, isInstructor, updateSection); // route tested
//!!! this should be delete method instead post!!!!!
router.delete("/deleteSection", auth, isInstructor, deleteSection); // route tested

//********************************************************************************************************************* */
//*                                     SubSection Routes
//********************************************************************************************************************* */

//********************************   all the routes are to be tested   ******************************** */
router.post("/createSubSection", auth, isInstructor, createSubSection);
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
//!!! this should be delete method instead post!!!!!
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);

//********************************************************************************************************************* */
//*                                     Rating And Reviews Routes
//********************************************************************************************************************* */

router.post("/createRating", auth, isStudent, createRating);
router.post("/getAverageRating", getAverageRating);
router.post("/getRating", getAllRating);

router.post("/createCategory", auth, isAdmin, createCategory); // admin only route // route tested
router.get("/showAllCategories", showAllCategories);// route tested
router.get("/categoryPageDetails", categoryPageDetails);// route tested

module.exports = router;
