import React, { useEffect, useState } from 'react'
import CoursesTable from './InstructorCourses/CoursesTable'
import IconBtn from '../../common/IconBtn'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI';

export default function MyCourses (){
    const navigate = useNavigate();
    const {token} = useSelector(state => state.auth)
    const [course,setCourse] = useState([])
    useEffect(()=>{
        const fetchCourses = async () =>{
            const result = await fetchInstructorCourses(token);
            if(!result){
                console.log('courses not found')
                return
            }
            console.log(result)
            setCourse(result)
        }
        fetchCourses()
        

    },[])

  return (
    <div>
        <IconBtn text="Add Course" onclick={() => navigate('/dashboard/add-course')}/>
        <CoursesTable course={course} setCourse={setCourse}/>
    </div>
  )
}
