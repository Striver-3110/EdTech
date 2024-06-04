const Profile = require("../models/Profile");
const Course = require("../models/Course");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.updateProfile = async (req, res) => {
  try {
    const {
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      firstName = "",
      lastName = "",
      gender = "",
    } = req.body;
    // if (!contactNumber) {
    //   return res.status(400).json({
    //     success: false,
    //     error: "please enter Phone Number!",
    //   });
    // }
    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(userId,{
      firstName,lastName
    });
    await user.save();

    const profile = await Profile.findById(user.additionalDetails);

    profile.dateOfBirth = dateOfBirth;
    profile.about = about;
    profile.contactNumber = contactNumber;
    profile.gender = gender;
    await profile.save();

    const updatedUserDetails = await User.findById(userId);



    return res.status(200).json({
      success: true,
      message: "Profile details added successfully",
      updatedUserDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;

    const user = await User.findById({ _id: id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Delete Associated Profile with the User
    await Profile.findByIdAndDelete({ _id: user.additionalDetails });
    // TODO: Unenroll User From All the Enrolled Courses
    // Now Delete User
    await User.findByIdAndDelete({ _id: id });
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "User Cannot be deleted successfully" });
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await User.findById({ _id: id })
      .populate("additionalDetails")
      .exec();
    console.log(userDetails);
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.updateDisplayPicture = async (req, res) => {
  try {
    // console.log(req.body.token);
    // console.log(req.files)
    console.log("this is displayPicture");
    console.log(req.files.displayPicture.name);
    if (!req.files || !req.files.displayPicture) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const displayPicture = req.files.displayPicture; // Updated this line
    const userId = req.user.id;
    console.log(userId);
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    console.log(image);
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message +
        `error in reading the undefined property displayPicture`,
    });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const userDetails = await User.findOne({
      _id: userId,
    })
      .populate("courses")
      .exec();
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      });
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.instructorDashboard = async (req, res) => {
  try {
    //? get instructor id from req.user
    const instructorId = req.user.id;
    console.log(
      "instructor id instructor dashboard profile apis is: ",
      instructorId
    );
    //? fetch all the courses of instructor
    const courses = await Course.find({ instructor: instructorId });
    const courseData = courses.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length;
      const totalAmountGenerated = course.price * totalStudentsEnrolled;

      // lets create course data object containing all the course related information
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.name,
        courseDescription: course.courseDescription,
        totalStudentsEnrolled,
        totalAmountGenerated,
      };
      return courseDataWithStats;
    });
    res.status(200).json({ courses: courseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
