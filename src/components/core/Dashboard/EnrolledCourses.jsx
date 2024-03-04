import React from 'react'

const EnrolledCourses = () => {
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
