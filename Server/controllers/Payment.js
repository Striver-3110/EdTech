const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const crypto = require("crypto");
const { default: mongoose } = require("mongoose");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");

exports.capturePayment = async (req, res) => {
  const { course_id } = req.body;
  const userId = req.user.id;

  if (!course_id) {
    return res.status(400).json({
      success: false,
      message: "Invalid course Id",
    });
  }
  let course;
  try {
    course = await Course.findById(course_id);
    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Could not find the course",
      });
    }
    // check weather the user has already paid for the course
    const uid = await mongoose.Types.ObjectId(userId);
    if (course.studentsEnrolled.includes(uid)) {
      return res.status(200).json({
        success: false,
        message: "Student already  enrolled in this course.",
      });
    }
  } catch (error) {
    //   console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  // creating an order
  const amount = course.price;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    receipt: Math.random(Date.now()).toString(),
    notes: {
      courseId: course_id,
      userId: userId,
    },
  };
  try {
    const paymentResponse = await instance.orders.create(options);
    if (!paymentResponse) {
      return res.status(400).json({
        success: false,
        message: "Payment failed please try after some time",
      });
    }
    return res.status(200).json({
      success: true,
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      thumbnail: course.thumbnail,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Could not initiate order",
    });
  }
}
// ********** Add to cart **********************************************************************************************************************************

//verify Signature of Razorpay and Server

exports.verifySignature = async (req, res) => {
  const webhookSecret = "12345678";
  
  const signature = req.headers["x-razorpay-signature"];
  
  const shasum = crypto.createHmac("sha256", webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");
  
  if (signature === digest) {
    console.log("Payment is Authorized");
    
    const { courseId, userId } = req.body.payload.payment.entity.notes;

    try {
      //fulfil the action

      //find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res.status(500).json({
          success: false,
          message: "Course not Found",
        });
      }

      console.log(enrolledCourse);
      
      //find the student and add the course to their list enrolled courses me
      const enrolledStudent = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { courses: courseId } },
        { new: true }
        );

      console.log(enrolledStudent);

      //mail send krdo confirmation wala
      const emailResponse = await mailSender(
        enrolledStudent.email,
        "Congratulations from CodeHelp",
        // "Congratulations, you are on-boarded into new CodeHelp Course"
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          enrolledStudent.firstName
        )
      );

      console.log(emailResponse);
      return res.status(200).json({
        success: true,
        message: "Signature Verified and COurse Added",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid request",
    });
  }
}
          
          // let stripe;
          // try{
          //     stripe=require("stripe")(process.env.STRIPE_SECRET);
          // }catch(e){console.log(e)}
          // ********** Add to cart **********************************************************************************************************************************
          // module.exports={
          //   addToCart: async (req, res) => {
          //       let userId = req.user._id;
          //       if (!userId) return res.status(401).send({ success: false, message: "Please login" });
          
          //       //Get the course from DB using its id
          //       const course = await Course.findById(req.params.id);
          //       if(!course) return res.status(404).json({message:"No such course found!"});
          
          //       //Checking whether the user is already enrolled in this course or not
          //       const isEnrolled = await User.isEnrolledInThisCourse(userId, course._id);
          //       if(isEnrolled) return res.status(409).json({message:'You are already enrolled in this course!'})
          
          //         //Adding the course to cart of the user
          //         const cart = await User.addToCart(userId, course);
          
          //         //Returning the updated cart
          //         return res.status(200).json(cart);
          //   },
          
          //   removeFromCart:async (req,res)=>{
          //      const removed = await User.removeFromCart(req.user._id,req.body.id);
          //      if(removed)
          //      {
          //        return res.status(200).json(removed);
          //      }else{
          //        return res.status(400).json({message:"Failed to remove from cart."});
          //      }
          //   },
          
          //   getCart:(req,res)=>
          //   {
          //     User.getCart(req.user._id)
          //     .then((cartData)=>{
          //       res.status(200).json(cartData);
          //     })
          //     .catch(err=>{
          //       console.log(err);
          //       res.status(500).json(err);
          //     })
          //   },
          
          //   checkout:(req,res,next)=>
          //   {
          //     const errors= validationResult(req);
          //     if (!errors.isEmpty()) {
          //       return res.status(422).json({ error: errors.array() });
          //     }
          //     else next();
          //   },
          
          //   processCheckout: async (req,res)=>
          //   {
          //     try{
          //       let order =await User.createOrder(req.user._id);
          //       await User.addToOrder(req.user._id,order._id,req.body.items);
          //       await User.emptyCart(req.user._id);
          //       req.session.destroy(() => {
          //         //console.log(req.session);
          //         res.json({message:'Thank you for your purchase! Your order has been processed.'});
          //       });
          //     } catch(e){
          //       console.log(e);
          //       res.status(500).send('Server Error');
          //     }
          //   }
          // };
