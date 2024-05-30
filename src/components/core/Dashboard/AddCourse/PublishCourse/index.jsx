import React, { useEffect, useState } from 'react'
import IconBtn from '../../../../common/IconBtn';
import { useDispatch, useSelector } from 'react-redux';
import { setStep } from '../../../../../slices/courseSlice';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { COURSE_STATUS } from '../../../../../utils/constants';
import { resetCourseState } from '../../../../../slices/courseSlice';
import { editCourseDetails } from '../../../../../services/operations/courseDetailsAPI';
export default function PublishCourse() {

    const {register, getValues, setValue,handleSubmit } = useForm();

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {course} = useSelector(state=>state.course);
    const {token} = useSelector(state=>state.auth)
    const [loading,setLoading] = useState(false)

    useEffect(()=>{
        if(course.status === COURSE_STATUS.PUBLISHED){
            setValue('public',true);
        }
    },[])
    const goToCourses = () => {
        dispatch(resetCourseState())
        navigate("/dashboard/my-courses")
      }
    const handleCoursePublish = async() =>{
        if (
            (course?.status === COURSE_STATUS.PUBLISHED &&
              getValues("public") === true) ||
            (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)
          ) {
            // form has not been updated
            // no need to make api call
            goToCourses()
            return
          }
          console.log('inside course publish ')
          const formData = new FormData();
          console.log("logging course id",course._id)
          formData.append("courseId",course._id);
          const courseStatus = getValues('public') ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT;
          console.log("logging courseStatus",courseStatus)
          formData.append("status",courseStatus)
          // console.log("logging FormData",formData)
          formData.forEach((value, key) => {
            console.log(key, value);
        });
          setLoading(true)
          console.log('calling editCourseDetails')
          const result = await editCourseDetails(formData,token)
          if(result) goToCourses()
          setLoading(false)
    }
    const onSubmit = (data) =>{
      console.log('onSubmit called')
        handleCoursePublish();
    }
    const goBack = () => {
        dispatchEvent(setStep(2))
    }
  return (
    <div className='border-[1px] border-richblack-700 bg-richblack-800 rounded-md p-6'>
        <p className='text-richblack-5 text-2xl font-semibold'>
            Publish Settings
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-6 mb-8">
          <label htmlFor="public" className="inline-flex items-center text-lg">
            <input
              type="checkbox"
              id="public"
              {...register("public")}
              className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
            />
            <span className="ml-2 text-richblack-400">
              Make this course as public
            </span>
          </label>
        </div>
            <div className=' ml-auto flex items-center max-w-max gap-x-4'>
                <button
                disabled={loading}
                type="button"
                onClick={goBack}
                className='flex gap-x-2 cursor-pointer items-center text-richblack-900 bg-richblack-300 rounded-md py-[8px] px-[20px]'
                >
                    Back
                </button>
                <IconBtn disabled={loading} text={`Save Changes`}></IconBtn>
            </div>
        </form>
    </div>
  )
}
