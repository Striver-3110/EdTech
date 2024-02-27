const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require('../utils/imageUploader');

exports.updateProfile = async (req, res) => {
  try {
    const { dateOfBirth = "", about = "", contactNumber } = req.body;
    if (!contactNumber) {
      return res.status(400).json({
        success: false,
        error: "please enter Phone Number!",
      });
    }
    const userId = req.user.id;
    const user = await User.findById({_id:userId});
    const profile = await Profile.findById(user.additionalDetails);

    profile.dateOfBirth = dateOfBirth;
    profile.about = about;
    profile.contactNumber = contactNumber;
    await profile.save();

    return res.status(200).json({
      success: true,
      profile,
      message: "Profile details added successfully",
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
    const userDetails = await User.findById({ _id:id })
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