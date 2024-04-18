import React from 'react'
// import Icons
import * as Icons from 'react-icons/vsc'

import { NavLink, matchPath, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {resetCourseState} from '../../../slices/courseSlice'
const SidebarLink = ({link,iconName}) => {
    const Icon = Icons[iconName]
    const dispatch = useDispatch()
    const location = useLocation()
    const matchRoute = (route) => {
        //? path present in the route will be matched with the pathname of the location!
        //? using matchPath function!
        //? based on its return value the style of the current link is updated
        return matchPath({path:route},location.pathname)
    }
  return (
    <NavLink
      to={link.path}
      onClick={() => dispatch(resetCourseState())}
      className={`relative px-8 py-2 text-sm font-medium ${
        matchRoute(link.path)
          ? 'bg-yellow-800 text-yellow-50'
          : 'bg-opacity-0 text-richblack-300'
      } transition-all duration-900`}
    >
      <span
        className={`absolute left-0 top-0 h-full w-[0.15rem bg-yellow-50] ${
          matchRoute(link.path) ? 'opacity-100' : 'opacity-0'
        }`}
      ></span>
      <div className='flex items-center gap-x-2'>
        <Icon className='text-lg'></Icon>
        <span>{link.name}</span>
      </div>
    </NavLink>
  )
}

export default SidebarLink
