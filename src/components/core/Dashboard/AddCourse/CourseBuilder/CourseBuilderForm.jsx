import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import IconBtn from '../../../../common/IconBtn'
import { MdAddCircleOutline } from 'react-icons/md'
import { BiAddToQueue } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux'
import { BiRightArrow } from 'react-icons/bi'
import {
  setCourse,
  setEditCourse,
  setStep
} from '../../../../../slices/courseSlice'
import { toast } from 'react-hot-toast'
import {
  createSection,
  updateSection
} from '../../../../../services/operations/courseDetailsAPI'
import NestedView from './NestedView'


export const CourseBuilderForm = () => {


  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm()

  const [editSectionName, setEditSectionName] = useState(null)
  const { course } = useSelector(state => state.course)
  const dispatch = useDispatch()
  const { token } = useSelector(state => state.auth)
  const [loading, setLoading] = useState(false)

  // useEffect(() => {
  //   console.log('Updated')
  // }, [course])
  const onSubmit = async data => {
    setLoading(true)
    let result = null

    if (editSectionName) {// weather the editSectionName value will be null or it will be id of the section 
      // that is being updated
      
      result = await updateSection(
        {
          sectionName: data.sectionName,
          sectionId: editSectionName,
          courseId: course._id
        },
        token
      )
    }else{
        result = await createSection(
            {
                sectionName:data.sectionName,
                courseId:course._id,
            },
            token
        )
        // console.log(result)
    }

    if(result ){
        dispatch(setCourse(result));
        setEditSectionName(null);
        setValue('sectionName','');
    }
    setLoading(false);
    // on the success full submission of this function
    // the length of the courseContent will be > 0
    // and the nestedView component will be rendered
  }
  const cancelEdit = () =>{
    setEditSectionName(null);
    setValue('sectionName','');
  }
  const goBack = () =>{
    dispatch(setStep(1))
    dispatch(setEditCourse(true))
  }
  const goToNext = () =>{
    if(course?.courseContent?.length === 0){
        toast.error('Please add at-least one Section')
        return
    }
    if (course.courseContent.some(section => section.subSection.length === 0)) {
        toast.error('Please add atleast one lecture in each section')
        return
      }
      //if everything is good
      dispatch(setStep(3))
    }



    const handleChangeEditSectionName = (sectionId, sectionName) => {
      // this is used to return to the create section function and stop the editSection 
      if (editSectionName === sectionId) {
        cancelEdit()
        return
      }
      
      // this will set the editSectionName to the sectionId
      setEditSectionName(sectionId)
      // this will bring current secName to the input 
      setValue('sectionName', sectionName)
    }
  
    return (
      <div className='text-white'>
        <p>Course Builder</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor='sectionName'>
              Section name <sup>*</sup>
            </label>
            <input
              id='sectionName'
              placeholder='Add section name'
              {...register('sectionName', { required: true })}
              className='w-full'
            />
            {errors.sectionName && <span className='ml-2 text-xs tracking-wide text-pink-200'>Section Name is required</span>}
          </div>
          <div className='mt-10 flex w-full'>
            <IconBtn
              type='submit'
              text={editSectionName ? 'Edit Section Name' : 'Create Section'}
              outline={true}
              customClasses={'text-white'}
            >
              <MdAddCircleOutline className='text-yellow-50' size={20} />
            </IconBtn>
            {editSectionName && (
              <button
                type='button'
                onClick={cancelEdit}
                className='text-sm text-richblack-300 underline ml-10'
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
  
        {course?.courseContent?.length > 0 && (
          <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
        )}
  
        <div className='flex justify-end gap-x-3 mt-10'>
          <button
            onClick={goBack}
            className='rounded-md cursor-pointer flex items-center '
          >
            Back
          </button>
          <IconBtn text='Next' onclick={goToNext}>
            <BiRightArrow />
          </IconBtn>
        </div>
      </div>
    )
  }
  
  export default CourseBuilderForm
  