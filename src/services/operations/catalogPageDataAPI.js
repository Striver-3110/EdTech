import { apiConnector } from "../apiConnector";
import { catalogData } from "../apis";
import toast from "react-hot-toast";

export const getCatalogPageData = async (categoryId) =>{
    const toastId = toast.loading("Loading.......");
    let results = []

    try {
        const response = await apiConnector("POST",catalogData.CATALOGPAGEDATA_API,
        {
            categoryId: categoryId,
        })
        // results = response
        console.log("getCategoryPageDetails response:........",response)
    } catch (error) {
        
    }
    toast.dismiss(toastId)
    // return results
}