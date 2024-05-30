const User = require("../models/User");
const Category = require("../models/Category");
const Course = require("../models/Course");
require("dotenv").config();
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { categories } = require("../../src/services/apis");

//****************************************************************************************** */
//*                                 Create a course(authorized to instructor only)
//****************************************************************************************** */

exports.editCourse = async (req,res) =>{
  try{
    let {courseId} = req.body;
    const course = await Course.findById(courseId)
    if(!course){
      return res.status(404).json({
        success:false,
        message:"Course Not Found"
      })
    }

    //?if thumbnail is passed to be updated?
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
    // await course.save()

    // const updatedCourse = await Course.findById(courseId)

    

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
