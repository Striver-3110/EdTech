const Category = require("../models/Category");

//************************************************************************************************************* */
//*                           create Category ka handler function
//************************************************************************************************************* */

exports.createCategory = async (req, res) => {
  try {
    //fetch data
    const { name, description } = req.body;
    //validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    //create entry in DB
    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(categoryDetails);
    //return response

    return res.status(200).json({
      success: true,
      message: "Category Created Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//************************************************************************************************************* */
// *                     getAllCategories handler function
//************************************************************************************************************* */

exports.showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find(
      {},
      { name: true, description: true }
    );
    res.status(200).json({
      success: true,
      message: "All Categories returned successfully",
      allCategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//************************************************************************************************************* */
//*                          get categoryDetails for similar, other, and top selling categories 
//************************************************************************************************************* */


exports.categoryPageDetails = async (req, res) => {
  try {

    // get categoryId from req.body
    const { categoryId } = req.body;
    console.log("category id at category page details controller of Category.js",categoryId)
    
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "No Category Id provided.",
      });
    }
    // get courses for specified category
    const selectedCategory = await Category.findById({ _id: categoryId })
      .populate("courses")
      .exec();

    // validation
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "data not found for the specified category",
      });
    }

    // get courses for different categories
    const differentCategories = await Category.find({
      _id: { $ne: categoryId },
    })
      .populate(["courses"])
      .exec();

    const topTenSellingCourses = await Category.aggregate([
      {
        $project: {
          name: 1,
          description: 1,
          courses: {
            $slice: ["$courses", 10], // Limit the array to 10 elements
          },
        },
      },
      {
        $lookup: {
          from: "courses", // Assuming the collection name is "courses"
          localField: "courses",
          foreignField: "_id",
          as: "courses",
        },
      },
      {
        $unwind: "$courses",
      },
      {
        $sort: { "courses.price": 1 },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          description: { $first: "$description" },
          courses: { $push: "$courses" },
        },
      },
      {
        $limit: 10,
      },
    ]);

    // Return response
    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategories,
        topTenSellingCourses,
      },
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
