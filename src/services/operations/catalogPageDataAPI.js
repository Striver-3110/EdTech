import { apiConnector } from "../apiConnector";
import { catalogData } from "../apis";
import {toast} from "react-hot-toast";

export const getCatalogPageData = async (categoryId) =>{
    const toastId = toast.loading("Loading.......");
    let result = []

    try {
        const response = await apiConnector("POST",catalogData.CATALOGPAGEDATA_API,
        {
            categoryId: categoryId,
        })
        // results = response
        if (!response?.data?.success) {
            throw new Error("Could Not Fetch Category page data.")
          }
          // console.log(response)
          result = response?.data
        } catch (error) {
          console.log("CATALOGPAGEDATA_API API ERROR............", error)
          toast.error(error.message)
          result = error.response?.data
        }
        toast.dismiss(toastId)
        return result
}