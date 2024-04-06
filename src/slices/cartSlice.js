import { createSlice } from "@reduxjs/toolkit";

import { toast } from "react-hot-toast";

const initialState = {
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
  total: localStorage.getItem("total")
    ? JSON.parse(localStorage.getItem("total"))
    : 0,
  totalItems: localStorage.getItem("totalItems")
    ? JSON.parse(localStorage.getItem("totalItems"))
    : 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    //! below reducer will run when the user clicks on the add to cart button in the --- page
    //? here the state is the state of the cart slice before the course is added into the cart
    addToCart: (state, value) => {
      //? collect course from value.payload
      const course = value.payload;
      //? the below lines checks the cart state and find weather the selected course has already been added to the cart or not.
      const index = state.cart.findIndex((item) => item._id === course._id);

      //? if index is non negative that means that the course is not added in the cart!
      //? so it allows to add the course in the cart
      //? else error will be thrown using toaster
      if (index >= 0) {
        toast.error("Course already in cart");
        return;
      }

      //? setting cart by pushing new course in to cart slice
      state.cart.push(course);
      state.totalItems++;
      state.total += course.price;

      //? updating local storage for the future uses
      localStorage.setItem("cart", JSON.stringify(state.cart));
      localStorage.setItem("total", JSON.stringify(state.total));
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems));

      toast.success("Course added to cart");
    },

    //! below reducer will run when the user clicks on the remove from cart button in the --- page
    //? here the state is the state of the cart slice before the course is removed from the cart
    removeFromCart: (state, value) => {
      const courseId = value.payload;
      const index = state.cart.findIndex((item) => item._id === courseId);

      if (index >= 0) {
        state.totalItems--;
        state.total -= state.cart[index].price;
        state.cart.splice(index, 1);

        localStorage.setItem("cart", JSON.stringify(state.cart));
        localStorage.setItem("total", JSON.stringify(state.total));
        localStorage.setItem("totalItems", JSON.stringify(state.totalItems));

        toast.info(`Removed from cart`);
      } else {
          console.log("No such course found");
          toast.error('No such course found');
      }
    },
    resetCart: (state) => {
      state.cart = [];
      state.total = 0;
      state.totalItems = 0;
      localStorage.removeItem("cart");
      localStorage.removeItem("total");
      localStorage.removeItem("totalItems");
    },
  },
});

export const {addToCart, removeFromCart, resetCart} = cartSlice.actions;

// The function below is called a selector and returns a new piece of state based on the store's current state.

export default cartSlice.reducer