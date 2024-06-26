import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  signupData: null,
  loading: false,
  //   token: localStorage.getItem("token")
  //     ? JSON.parse(localStorage.getItem("token"))
  //         : null,
  //   above line has changed to below
  token: localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : null,
  //         : null,,
  // localStorage.getItem("token")
  // ? localStorage.getItem("token")
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData: (state, value) => {
      state.signupData = value.payload;
      // state.loading=true;
    },
    setLoading: (state, value) => {
      state.loading = value.payload;
    },
    setToken: (state, value) => {
      state.token = value.payload;
    },
  },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;
