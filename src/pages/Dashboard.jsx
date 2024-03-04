import React from 'react'
import { useSelector } from 'react-redux'
import {Outlet} from 'react-router-dom'

const Dashboard = () => {
  const { loading: profileLoading } = useSelector(state => state.profile)
  const { loading: authLoading } = useSelector(state => state.auth)

  if (profileLoading || authLoading) {
    return (
      <div>
        <div className='spinner grid min-h-[calc(100vh-3.5rem)] place-items-center'>
          Loading...
        </div>
      </div>
    )
  }
    return <div>
        <Sidebar />
        <div className='h-[calc(100vh-3.5rem)] flex-1 overflow-auto'>
            <div className='mx-auto w-11/12 max-w-[1000px] py-10'>
                <Outlet/>
            </div>
        </div>
  </div>
}

export default Dashboard
