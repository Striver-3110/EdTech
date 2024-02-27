import { toast } from "react-hot-toast";
// import { setLoading } from "../../slices/authSlice";
import { endpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import {
  setSignupData,
  setLoading,
  setToken
}from '../../slices/authSlice'
// const  = authReducer;
import {setUser} from '../../slices/profileSlice';
// const  = profileReducer
import {
  addToCart, removeFromCart, resetCart
} from '../../slices/cartSlice'
// const  = cartReducer;
const {
  SENDOTP_API,
  LOGIN_API,
  SIGNUP_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints;

export const sendOTP = (email, navigate) => {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    //    the dispatch function, which is typically associated
    //    with state management in libraries like Redux, as part
    //    of asynchronous action creators.The dispatch function is
    //    used to send actions to the Redux store, which then triggers
    //    the corresponding reducers to update the state.
    dispatch(setLoading(true));
    try {
      console.log(SENDOTP_API);
      const response = await apiConnector("POST", SENDOTP_API, {
        email: email,
        checkUserPresent: true,
      });
      console.log("SENDOTP api response ............", response);
      console.log(response.data.success);
      if (!response.data.success) {
        throw new Error();
      } else {
        toast.success("OTP Sent Successfully");
        // navigating to next page after sending OTP
        navigate("/verifyEmail");
      }
    } catch (error) {
      console.log("send otp api error.........");
      toast.error("Could not send otp");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
};

export const signUp = (
  email,
  firstName,
  lastName,
  password,
  confirmPassword,
  accountType,
  contactNumber,
  otp,
  navigate
) => {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
      dispatch(setLoading(true));
      try {
          const response = await apiConnector('POST', SIGNUP_API, {
              accountType,
              firstName,
              lastName,
              email,
              password,
              confirmPassword,
              otp,
          });
          console.log('signup api response', response);
          if (!response.data.success) {
              throw new Error(response.data.message);
          }
          toast.success("Singup Successful");
          navigate('/login');
      } catch (error) {
          console.log('SIGNUP API ERROR.......', error);
          toast.error('Signup failed');
          navigate('/signup');
      }
      dispatch(setLoading(false));
      toast.dismiss(toastId);
  };
};

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "POST",
        LOGIN_API,
        {
          email,
          password,
        }
      );

      console.log("LOGIN API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Login Successful");
      /**
       * The difference between response.data.user.accountType and response.data?.user?.accountType lies in how they handle potential null or undefined values.

      response.data.user.accountType:

      This syntax assumes that response.data and response.data.user are not null or undefined.
      If either response.data or response.data.user is null or undefined, attempting to access accountType would result in a runtime error.
      response.data?.user?.accountType:

      This syntax uses the optional chaining (?.) operator.
      It provides a safeguard against null or undefined values. If response.data or response.data.user is null or undefined, the expression will not throw an error. Instead, it will short-circuit and return undefined.
      In summary, the optional chaining operator (?.) is useful when you want to navigate through nested properties and handle potential null or undefined values without causing runtime errors. It's a way to make your code more resilient in the face of uncertain data structures.
       * 
       */
      dispatch(setToken(response.data.token));
      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;
      dispatch(setUser({ ...response.data.user, image: userImage }));
      localStorage.setItem("token", JSON.stringify(response.data.token));
      navigate("/");
    } catch (error) {
      console.log("LOGIN API ERROR............", error);
      toast.error("Login Failed");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      });

      console.log("RESETPASSTOKEN RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Reset Email Sent");
      setEmailSent(true);
    } catch (error) {
      console.log("RESETPASSTOKEN ERROR............", error);
      toast.error("Failed To Send Reset Email");
    }
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}

export function resetPassword(password, confirmPassword, token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      });

      console.log("RESETPASSWORD RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password Reset Successfully");
      navigate("/login");
    } catch (error) {
      console.log("RESETPASSWORD ERROR............", error);
      toast.error("Failed To Reset Password");
    }
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}


export const logout= (navigate)=> {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    navigate("/");
  };
}