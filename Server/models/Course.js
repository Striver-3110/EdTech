const mongoose = require("mongoose");

const Course = mongoose.Schema({
  courseName: {
    type: String,
  },

  courseDescription: { type: String },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  whatYouWillLearn: { type: String },

  // sections of course
  courseContent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  ],

  ratingAndReviews: [
    { type: mongoose.Schema.Types.ObjectId, ref: "RatingAndReviews" },
  ],

  price: {
    type: Number,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  thumbnail: { type: String },
  tag: { type: [String], required: true },
  // TO-Review:: why this is only object************************************????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
  //* solved!!
  studentsEnrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  }],
  instructions: {
    type: [String],
  },
  status: {
    type: String,
    enum: ["Draft", "Published"],
  },
});

module.exports = mongoose.model("Course", Course);
