import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

//? once the user have logged in
//? and then try to access login page then
//? he must be redirected to dashboard page

export default function OpenRoute ({ children }) {
  const { token } = useSelector(state => state.auth)
  if (token === null) {
    return children
  } else {
      return <Navigate to='dashboard/my-profile'/>
    // return children
  }
}