import axios from "axios";
// import { FaHeart } from "react-icons/fa";

export const axiosInstance = axios.create({});

export const apiConnector = (method, url, body, headers, params) => {
  // console.log(
  //   "API CONNECTOR CALLED",
  //   " method: " + method,
  //   " url:" + url,
  //   " body:" + body,
  //   " headers: " + headers,
  //   " params: " + params
  // );
  // console.log(body ? body : "");
  const axiosinstance = axiosInstance({
    method: method,
    url: url,
    // data parsed from api call
    data: body ? body : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  });
  if (!axiosinstance) {
    console.log("error in axios instantiation");
  }

  return axiosinstance;
    //? all the change that i did to solve (undefined values of body and headers and params is that instead of parsing directly
    //? parsed by creating an object
    //? and in order to make correct axios call i changed below code to above code)
    // return axiosInstance({
    //   method: `${method}`,
    //   url: `${url}`,
    //   // data parsed from api call
    //   data: body ? body : null,
    //   headers: headers ? headers : null,
    //   params: params ? params : null,
    // });
};
