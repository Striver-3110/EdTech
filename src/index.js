import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from './reducer/index';

const store = configureStore({
  reducer:rootReducer,
})

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
        <Toaster/>
      </Router>
    </Provider>
  </React.StrictMode>
);
