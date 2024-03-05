import React, { useEffect } from 'react'
import ProgressBar from '@ramonak/react-progress-bar'
import { useState } from 'react'
import { getUserEnrolledCourses } from '../../../services/operations/profileAPI'
import { useSelector } from 'react-redux'

const EnrolledCourses = () => {
  const {token } = useSelector(state=>state.auth)
    const [enrolledCourses, setEnrolledCourses] = useState(null)
    const getEnrolledCourses = async () => {
        try {
            const response = await getUserEnrolledCourses(token)
            // setEnrolledCourses(response.data)
            setEnrolledCourses(response)
        } catch (error) {
            console.log('Unable to fetch Enrolled Courses')
            
        }
    }
    useEffect(() => {
        getEnrolledCourses()
    })

  return (
    <div className='text-white'>
      <div>Enrolled Courses</div>
      {!enrolledCourses ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div>
            <p>Course Name</p>
            <p> Durations</p>
            <p>Progress</p>
          </div>
          {/* Cards starts here*/}
          {enrolledCourses.map((course, index) => {
            return (
              <div>
                <div>
                  <img src={course.thumbnail} alt='' />
                  <div>
                    <p>{course.courseName}</p>
                    <p>{course.courseDescription}</p>
                  </div>
                </div>
                <div>{course?.totalDuration}</div>
                <div>
                  <p>Progress:{course.progressPercentage}</p>
                  <ProgressBar
                    completed={course.progressPercentage || 0}
                    height='8px'
                    ilLabelVisible={false}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default EnrolledCourses
