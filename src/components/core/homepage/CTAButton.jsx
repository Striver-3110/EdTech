import React from 'react'
import { Link } from 'react-router-dom'

function CTAButton ({ children, text, active, linkto }) {
  return (
    <Link to={linkto}>
      <div
        className={`text-center text-[13px] px-6 py-3 rounded-md font-bold
          ${
            active ? 'bg-yellow-50 text-black' : 'bg-richblack-800'
          } hover:scale-95 transition-all duration-200
          `}
      >
        <div className='flex gap-2 items-center'>
          {text}
          {children ? children : ''}
        </div>
      </div>
    </Link>
  )
}

export default CTAButton
