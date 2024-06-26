import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'
import GetAvgRating from '../../../utils/getAvgRating'
import RatingStars from '../../common/RatingStars'

export default function CourseCard ({ course, height }) {
    const [avgReviewCount,setAvgReviewCount] = useState(0)
    useEffect(() => {
        const count = GetAvgRating(course.ratingAndReviews)
        setAvgReviewCount(count)
      }, [course])
//   console.log('course at course Card component is :', course)
  return (
    <>
      <Link to={`/courses/${course._id}`}>
        <div>
          <div className='rounded-lg'>
            <img
              src={course.thumbnail}
              alt='Course Image'
              className={`${height} w-full rounded-xl object-cover`}
            />
          </div>
          <div className='flex flex-col gap-2 px-1 py-3'>
            <p className='text-xl text-richblack-5'>{course.courseName}</p>
            <p className='text-sm text-richblack-50'>
              {course?.instructor?.firstName}
            </p>
            <div className='flex items-center gap-2'>
              <span className='text-yellow-5'>{avgReviewCount || 0}</span>
              {/* <ReactStars
                count={5}
                value={avgReviewCount || 0}
                size={20}
                edit={false}
                activeColor="#ffd700"
                emptyIcon={<FaRegStar />}
                fullIcon={<FaStar />}
              /> */}
              <RatingStars Review_Count={avgReviewCount} />
              <span className='text-richblack-400'>
                {course?.ratingAndReviews?.length} Ratings
              </span>
            </div>
            <p className='text-xl text-richblack-5'>Rs. {course?.price}</p>
          </div>
        </div>
      </Link>
    </>
  )
}
