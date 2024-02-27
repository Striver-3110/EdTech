const mongoose = require("mongoose");
const objId = mongoose.Schema.Types.ObjectId;

const Category = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  // review: {
  //   type: String,
  //   required: true,
  // },

  //why this course is just an object instead an array!! while same category should have multiple courses!!!
  //* solved
  courses: [
    {
      type: objId,
      ref: "Course",
    },
  ],
});

module.exports = mongoose.model("Category", Category);
