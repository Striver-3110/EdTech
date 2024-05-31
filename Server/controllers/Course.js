const User = require("../models/User");
const Category = require("../models/Category");
const Course = require("../models/Course");
const SubSection = require('../models/SubSection')
const Section = require('../models/Section')
require("dotenv").config();
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { categories } = require("../../src/services/apis");

//****************************************************************************************** */
//*                                 Create a course(authorized to instructor only)
//****************************************************************************************** */

exports.editCourse = async (req,res) =>{
  try{
    console.log("request body is:................................",req.body)
    let {courseId} = req.body;
    console.log(courseId)
    const course = await Course.findById(courseId)
    if(!course){
      return res.status(404).json({
        success:false,
        message:"Course Not Found"
      })
    }

    //?it thumbnail is passed to be updated?
    if(req.files){
      const thumbnail = req.files.thumbnailImage
      // upload it to cloudinary

      const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME)
      course.thumbnail = thumbnailImage.secure_url
    }

    //?lets take remaining items that are passed in the request so that we can update them in the course
    const updates = req.body;
    for(const key in updates){
      if(updates.hasOwnProperty(key)){
        if(key === 'tag' || key === 'instructions'){
          course[key] = JSON.parse(updates[key])
        }else{
          course[key] = updates[key]
        }
      }
    }
    await course.save()

    const updatedCourse = await Course.findById(courseId)
    .populate({
      path: "instructor",
      populate: {
        path: "additionalDetails",
      },
    })
    .populate("category")
    .populate("ratingAndReviews")
    .populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    })
    .exec()

    // const updatedCourse = await Course.findById(courseId)

    return res.status(200).json({
      success:true,
      message:"course added successfully",
      data:updatedCourse
    })

    

  }catch(error){
    console.log("error:", error)
    return res.status(200).json({
      msg:'internal server error',
      error:error,
    })
  }
}

exports.createCourse = async (req, res) => {
  try {
    // const data = req.body.data
    const {
      courseName,
      courseDescription,
      category,
      whatYouWillLearn,
      price,
      tag,
      status,
      instructions,
    } = req.body;


    const thumbnail = req?.files?.thumbnailImage;

    if (
      !courseName ||
      !courseDescription ||
      !category ||
      !whatYouWillLearn ||
      !price ||
      !thumbnail ||
      !tag||
      !status||
      !instructions
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Please fill all fields" });
    }

    // check weather the requesting person is user of the application or not!

    const userId = req.user.id;
    const instructorDetails = await User.findById(userId, {
      accountType: "Instructor",
    });
    // console.log("User details:", instructorDetails);

    if (!instructorDetails) {
      console.log("No user found with this id!");
      return res
        .status(404)
        .json({ success: false, message: "No user found." });
    }

    //check given Category is valid or not!
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Category!" });
    }
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // create new course

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      whatYouWillLearn,
      instructor: instructorDetails._id,
      price,
      tag: tag,
      category: categoryDetails._id,
      status: status,
      thumbnail: thumbnailImage.secure_url,
      instructions: instructions,
    });

    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: { courses: newCourse._id },
      },
      { new: true }
    );

    // Category Schema Update
    const categorySchemaUpdate = await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          //!### course or courses??
          courses: newCourse._id,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create Course",
      error: error.message,
    });
  }
};

//****************************************************************************************** */
//*                                 show all courses
//****************************************************************************************** */

exports.showAllCourses = async (req, res) => {
  try {
    const allCourse = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();
    return res.status(200).json({
      success: true,
      message: "Data for all courses fetched successfully",
      data: allCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot Fetch course data",
      error: error.message,
    });
  }
};

//****************************************************************************************** */
//*                                 getCourseDetails
//****************************************************************************************** */

//
exports.getCourseDetails = async (req, res) => {
  //!! by mistake passed

  //!   {
  //!       "courseId":65d474fc3b6909685b3015ef
  //!   }

  //!   inside the body for route testing instead
  //!    {
  //!       "courseId":"65d474fc3b6909685b3015ef"
  //!    }
  try {
    //get id
    const { courseId } = req.body;
    console.log(courseId);
    //find course details
    const courseDetails = await Course.find({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      // //.populate("ratingAndreviews")
      // .populate({
      //   path: "courseContent",
      // populate: {
      //   path: "subSection",
      // },
      // })
      .exec();

    //validation
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find the course with ${courseId}`,
      });
    }
    //return response
    return res.status(200).json({
      success: true,
      message: "Course Details fetched successfully",
      data: courseDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getInstructorCourses = async(req,res) =>{
  try {
    const instructorId = req.user.id
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 })

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}

exports.deleteCourse = async(req,res) =>{
  try {
    // const instructor = req.user.id;
    // console.log(instructor)
    const {courseId} = req.body;
    const course = await Course.findById(courseId);

    if(!course){
      return res.status(404).json({
        success:false,
        message:"course not found!"
      })
    }


    //? remove this course from all the enrolled students
    const enrolledStudents = course.studentsEnrolled;
    console.log("enrolled students are: ",enrolledStudents)

    for(const studentId of enrolledStudents){
      // const studentId = student._id;
      await User.findByIdAndUpdate(studentId,{
        $pull:{courses:courseId}
      })
    }

    //? delete all the section of the course

    const sections = course.courseContent
    for(const sectionId  of sections){
      const section = await Section.findById(sectionId)
      if (section) {
        const subSection = section.subSection
        for(const subSectionId of subSection){// here subSec will be id of sub section
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }
      await Section.findByIdAndDelete(sectionId)
    }


    const result = await Course.findByIdAndDelete(courseId)
    return res.status(200).json({
      success:true,
      message:"course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}