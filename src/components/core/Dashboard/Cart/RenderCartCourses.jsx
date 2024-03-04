import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RiDeleteBin6Line } from 'react-icons/gi'
import { removeFromCart } from '../../../slices/cartSlice'
import ReactStars from 'react-rating-stars-component'

const RenderCartCourses = () => {
  return (
    <div>
      {cartSlice.map((course, index) => {
        return (
          <div>
            <div>
              <img src={course?.thumbnail} alt='' />
              <div>
                <p>{course?.courseName}</p>
                <p>{course?.category?.name}</p>
                <div>
                  <span>4.8</span>
                  <ReactStars
                    count={5}
                    size={20}
                    edit={false}
                    activeColor='#ffd700'
                    emptyIcon={<GiNinjaStar />}
                    fullIcon={<GiNinjaStar />}
                  />
                  <span>{course?.ratingAndReviews?.length}Ratings</span>
                </div>
              </div>
            </div>
            <div>
              <button onClick={() => dispatch(removeFromCart(course._id))}>
                <RiDeleteBin6line />
                <span>Remove</span>
              </button>
              <p>Rs {course?.price}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default RenderCartCourses
