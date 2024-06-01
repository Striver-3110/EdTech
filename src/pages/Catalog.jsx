import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiConnector'
import { categories } from '../services/apis'
import { getCatalogPageData } from '../services/operations/catalogPageDataAPI'
import Error from './Error'
import Footer from '../components/common/Footer'
import CourseSlider from '../components/core/Catalog/CourseSlider'


export default function Catalog () {
  const [catalogPageData, setCatalogPageData] = useState(null)
  const [categoryId, setCategoryId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(1)

  //? remember that the catalog name is present in the req url
  //? fetch catalogName from the url when it is present in the url
  const { catalogName } = useParams()

  //? once catalogName is present in the url fetch all the categories present in the db
  //? find the id of the one which is present in the req url
  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const allCategories = await apiConnector(
          'GET',
          categories.CATEGORIES_API
        )
        setLoading(false)

        // console.log("all the categories at catalog are:",allCategories?.data?.allCategories)
        let fetchedCategoryId = allCategories?.data?.allCategories?.filter(
          c => {
            return (
              c.name.split(' ').join('-').split('/').join('-').toLowerCase() ===
              catalogName
            )
          }
        )[0]?._id
        // console.log("category id at catalog page is:......\n",fetchedCategoryId)
        setCategoryId(fetchedCategoryId)
      } catch (error) {
        console.log('error at catalog page is:............\n', error)
      }
    })()
  }, [catalogName])

  useEffect(() => {
    if (categoryId)
      (async () => {
        setLoading(true)

        try {
          const res = await getCatalogPageData(categoryId)
          console.log(res)
          setCatalogPageData(res)
        } catch (error) {
          console.log('Error at Catalog.jsx', error)
        }
        setLoading(false)
      })()
  }, [categoryId])

  if (loading || !catalogPageData) {
    return (
      <div className='grid min-h-[calc(100vh-3.5rem)] place-items-center'>
        <div className='spinner'></div>
      </div>
    )
  }
  if (!loading && !catalogPageData.success) {
    return <Error />
  }

  return (
    <>
      {/* HeroSection of Catalog Page */}
      <div className=' box-content bg-richblack-800 px-4'>
        <div className='mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent '>
          <p className='text-sm text-richblack-300'>
            Home / Catalog /
            <span className='text-yellow-25'>
              {' ' + catalogPageData?.data?.selectedCategory?.name}
            </span>
          </p>
          <p className='text-3xl text-richblack-5'>
            {catalogPageData?.data?.selectedCategory?.name}
          </p>
          <p className='max-w-[870px] text-richblack-200'>
            {catalogPageData?.data?.selectedCategory?.description}
          </p>
        </div>
      </div>
      {/* Section 1 of catalog page */}
      <div className=''>
        <div>Courses to get you started</div>
        <div>
          <p
            className={`px-4 py-2 ${
              active === 1
                ? 'border-b border-b-yellow-25 text-yellow-25'
                : 'text-richblack-50'
            } cursor-pointer`}
            onClick={() => setActive(1)}
          >
            Most Popular
          </p>
          <p
            className={`px-4 py-2 ${
              active === 2
                ? 'border-b border-b-yellow-25 text-yellow-25'
                : 'text-richblack-50'
            } cursor-pointer`}
            onClick={() => setActive(2)}
          >
            New
          </p>
          <div>
          <CourseSlider courses={catalogPageData?.data?.selectedCategory?.courses}/>
          </div>
        </div>
      </div>
      {/* Section 2 of catalog page */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">
          Top courses in {catalogPageData?.data?.differentCategory?.name}
        </div>
        <div className="py-8">
            {/* to be implemented */}
            <CourseSlider courses={catalogPageData?.data?.selectedCategory?.courses}/>

            
        </div>
      </div>

      {/* Section 3 of catalog page */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Frequently Bought</div>
        <div className="py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* to be implemented */}
            <span className='text-white'>
         Course Slider
            </span>
          </div>
        </div>
      </div>
<Footer/>
    </>
  )
}
