import React, { useEffect, useState } from 'react'
import { fetchCourseDetails } from '../services/operations/courseDetailsAPI'
import { useParams } from 'react-router-dom'
import RatingStars from '../components/common/RatingStars'
import GetAvgRating from '../utils/getAvgRating'
import { BiInfoCircle } from 'react-icons/bi'
import { formatDate } from '../services/formateData'
import { HiOutlineGlobeAlt } from 'react-icons/hi'

export default function CourseDetails () {
  const { courseId } = useParams()
  const [course, setCourse] = useState([])

  useEffect(() => {
    (async () => {
      try {
        const courseDetails = await fetchCourseDetails(courseId)
        // console.log("course Details at courseDetails Page is:.....",courseDetails?.data[0])
        setCourse(courseDetails.data[0])
        console.log('course Details at courseDetails Page is:.....', course)
        // console.log("courseName is:...")
      } catch (error) {
        console.log('error while fetching course details', error)
      }
    })()
  }, [courseId])


  const [avgReviewCount,setAvgReviewCount] = useState(0)

  useEffect(()=>{
    const count = GetAvgRating(ratingAndReviews)
    setAvgReviewCount(count)
  },[course])

  const {
    courseId: _id,
    courseName,
    createdAt,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEnrolled
  } = course
  // console.log(courseId,courseName,courseDescription,createdAt)

  const handleBuyCourse = () =>{
    if(token){
        buyCourse
    }
  }
  return (
    <>
      {/*we will keep the parent container relatively positioned as we have to adjust course price card*/}
      <div className='w-full bg-richblack-800 relative'>
        {/* Hero Section */}
        <div className='mx-auto box-content px-4 lg:w-[1260px] 2xl:relative'>
          <div className='mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]'>
            <div className='relative block max-h-[30rem] lg:hidden'>
              <div className='absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]'></div>
              <img
                src={thumbnail}
                alt='course thumbnail'
                className='aspect-auto w-full'
              />
            </div>
            <div
              className={`z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5`}
            >
              <div>
                <p className='text-4xl font-bold text-richblack-5 sm:text-[42px]'>
                  {courseName}
                </p>
              </div>
              <p className={`text-richblack-200`}>{courseDescription}</p>
              <div className="text-md flex flex-wrap items-center gap-2">
                <span className="text-yellow-25">{avgReviewCount}</span>
                <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                <span>{`(${ratingAndReviews?.length} reviews)`}</span>
                <span>{`${studentsEnrolled?.length} students enrolled`}</span>
              </div>
              <div>
                <p className="">
                  Created By {`${instructor?.firstName} ${instructor?.lastName}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-5 text-lg">
                <p className="flex items-center gap-2">
                  {" "}
                  <BiInfoCircle /> Created at {formatDate(createdAt)}
                </p>
                <p className="flex items-center gap-2">
                  {" "}
                  <HiOutlineGlobeAlt /> English
                </p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4 lg:hidden">
              <p className="space-x-3 pb-4 text-3xl font-semibold text-richblack-5">
                Rs. {price}
              </p>
              <button className="yellowButton" onClick={handleBuyCourse}>
                Buy Now
              </button>
              <button className="blackButton">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
