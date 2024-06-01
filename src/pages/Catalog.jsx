import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { apiConnector } from '../services/apiConnector';
import { categories } from '../services/apis';

export default function Catalog() {
    const [categoryPageData, setCategoryPageData] = useState(null);
    const [categoryId, setCategoryId] = useState(null);

    //? remember that the catalog name is present in the req url
    //? fetch catalogName from the url when it is present in the url
    const {catalogName} = useParams();

    //? once catalogName is present in the url fetch all the categories present in the db
    //? find the id of the one which is present in the req url
    useEffect(()=>{
        (async () =>{
            try {
                const allCategories = await apiConnector("GET",categories.CATEGORIES_API)
                console.log("all the categories at catalog are:",allCategories?.data?.allCategories)
                let fetchedCategoryId = allCategories?.data?.allCategories?.filter((c) => {
                    return c.name.split(" ").join("-").split("/").join("-").toLowerCase() === catalogName;
                })[0]?._id;
                console.log("category id at catalog page is:......\n",fetchedCategoryId)
            } catch (error) {
                console.log("error at catalog page is:............\n",error)
            }
        })()
    },[catalogName])
  return (
    <div className='box-content bg-richblack-800 px-4'>
        <div className=''>
            <p>
                "Home/Catalog/"{

                }
            </p>
        </div>

    </div>
  )
}
