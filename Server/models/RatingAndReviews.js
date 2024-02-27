const mongoose = require("mongoose");
const objId = mongoose.Schema.Types.ObjectId;

const RatingAndReviews = mongoose.Schema({
  user: {
    type: objId,
    required: true,
    ref: "User",
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  course: {
    type: objId,
    required: true,
    ref: "Course",
    index: true,
  },
});

module.exports = mongoose.model("RatingAndReviews", RatingAndReviews);
