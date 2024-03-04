//******************************************************* */ https://documenter.getpostman.com/view/24441701/2s93kz6REm
// ** TODO: give access to the course only if it is approved by atleast one of the admin
// ** Google for information security : what are the types of data ??

const express = require("express");
const app = express();

// import routes from different modules and add them as a route on the server
const userRoutes = require("./routes/UserRoute");
const paymentRoutes = require("./routes/PaymentRoute");
const courseRoutes = require("./routes/CourseRoute");
const profileRoutes = require("./routes/ProfileRoute");
const contactUsRoute = require("./routes/ContactUsRoute");

// import all dependencies
const { connectToMongo } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
app.options("*", cors());
const { connectToCloudinary } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
require("dotenv").config();

// connect to database
connectToMongo();
const PORT = process.env.PORT || 4000;

//! ****************************MIDDLEWARES******************************************************************************************************************************************************
//! ****************************MIDDLEWARES******************************************************************************************************************************************************
app.use(express.json()); // middleware for parsing json request body
app.use(cookieParser());
app.use(
  cors()
  // {
  // origin: "http://localhost:3000",
  // credentials: true,
  // optionsSuccessStatus: 200,
  // }
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

connectToCloudinary();

// setup all the paths

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);

// default route
app.get("/", (req, res) => {
  return res
    .status(200)
    .json({ success: true, message: "Welcome to Course Manager API" });
});

app.listen(PORT, () => {
  console.log(`App is running at port: ${PORT}`);
});
