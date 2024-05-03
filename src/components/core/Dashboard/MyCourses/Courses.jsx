import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {fetchInstructorCourses} from '../../../../services/operations/courseDetailsAPI'

const Courses = () => {
  const {token} = useSelector(state=>state.auth)
  // console.log(token)
  useEffect(()=>{
    fetchInstructorCourses(token)
  },[])
  return (
    <div className='text-white'>
      This is my course
    </div>
  )
}

export default Courses
