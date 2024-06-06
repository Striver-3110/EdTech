//!TODO: where else can i put config files

import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import Error from "./pages/Error";
import Contact from "./pages/Contact";
import About from "./pages/About";
import OpenRoute from "./components/core/Auth/OpenRoute";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Settings from "./components/core/Dashboard/Settings";
import Cart from "./components/core/Dashboard/Cart";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import EditCourse from "./components/core/Dashboard/EditCourse";
import Instructor from "./components/core/Dashboard/Instructor";
// import CoursesTable from "./components/core/Dashboard/InstructorCourses/CoursesTable";
import MyCourses from "./components/core/Dashboard/MyCourses";
import CourseDetails from "./pages/CourseDetails";

import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "./utils/constants";
import AddCourse from "./components/core/Dashboard/AddCourse";
import Catalog from "./pages/Catalog";

function App() {
  const { user } = useSelector((state) => state.profile);
  return (
    <div className="w-screen min-h-screen flex flex-col font-inter bg-richblack-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        ></Route>
        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        ></Route>
        <Route
          path="/catalog/:catalogName"
          element={
            <OpenRoute>
              <Catalog />
            </OpenRoute>
          }
        ></Route>
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/about"
          element={
            // <OpenRoute>
              <About />
            // </OpenRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        ></Route>
        <Route
          path="/update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        ></Route>
        <Route
          path="/verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        ></Route>
          <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >

          <Route path="/dashboard/my-profile" element={<MyProfile />} />
          <Route path="/dashboard/Settings" element={<Settings />} />
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
          <>
            <Route path="/dashboard/cart" element={<Cart />} />
            <Route
              path="/dashboard/enrolled-courses"
              element={<EnrolledCourses />}
            />
          </>
        )}
        {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
          <>
            <Route path="/dashboard/add-course" element={<AddCourse />} />
            <Route path="/dashboard/instructor" element={<Instructor className="text-white font-light bg-richblack-700"> This is information about instructor</Instructor>}></Route>
            <Route path="/dashboard/my-courses" element={<MyCourses className="text-white font-light bg-richblack-700"/>}></Route>
            <Route path="/dashboard/edit-course/:courseId" element={<EditCourse className="text-white font-light bg-richblack-700"/>}></Route>
          </>
        )}

        </Route>
        
        <Route path="*" element={<Error />}></Route>
      </Routes>
    </div>
  );
}

export default App;
