// import e from 'cors'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { BiArrowBack } from 'react-icons/bi'
import { useLocation, Link } from 'react-router-dom'
// import { UseSelector } from 'react-redux/es/hooks/useSelector'
import { useSelector } from 'react-redux'
import { resetPassword } from '../services/operations/authAPI'

const UpdatePassword = () => {
  const { loading } = useSelector(state => state.auth)
  //? initializing form data into forData
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  //? eye button handler for show password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  //? the dispatch function, which is typically associated
  //? with state management in libraries like Redux, as part
  //? of asynchronous action creators.The dispatch function is
  //? used to send actions to the Redux store, which then triggers
  //? the corresponding reducers to update the state.

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { password, confirmPassword } = formData
  // why location???
  // bcz when user will click on the link sent using forgot password api!!
  // the link will contain the token at the end of the path
  // and that token is required to verify the user at the update password page!!
  const location = useLocation()
  const handleOnChange = e => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [e.target.name]: e.target.value
    }))
  }
  const handleOnSubmit = e => {
    e.preventDefault()
    const token = location.pathname.split('/').at(-1)
    dispatch(
      resetPassword(
        formData.password,
        formData.confirmPassword,
        token,
        navigate
      )
    )
  }
  return (
    <div className='grid min-h-[calc(100vh-3.5rem)] place-items-center'>
      {loading ? (
        <div className='spinner'>Loading...</div>
      ) : (
        <div className='max-w-[500px] p-4 lg:p-8'>
          <h1 className='text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5'>
            Choose new password
          </h1>
          <p className='my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100'>
            Almost done! Enter your new password and you are all set.
          </p>
          <form onSubmit={handleOnSubmit}>
            <label className='relative'>
              <p className='mb-1 text-[-0.875rem] leading-[1.375rem] text-richblack-5'>
                New Password <sup className='text-pink-200'>*</sup>
              </p>
              <input
                required
                type={showPassword ? 'text' : 'password'}
                name='password'
                value={password}
                onChange={handleOnChange}
                placeholder='Enter Password'
                className=' w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-12 text-richblack-5'
                style={{
                  boxShadow: 'inset 0px -1px 0px rgba(255, 255, 255, 0.18)'
                }}
              />
              <span
                onClick={() => setShowPassword(prev => !prev)}
                className='absolute right-3 top-[38px] z-[10] cursor-pointer'
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF' />
                ) : (
                  <AiOutlineEye fontSize={24} fill='#AFB2BF' />
                )}
              </span>
            </label>
            <label className='relative mt-3 block'>
              <p className='mb-2 text-[-0.875rem] leading-[1.375rem] text-richblack-5'>
                Confirm New Password <sup className='text-pink-200'>*</sup>
              </p>
              <input
                required
                type={showConfirmPassword ? 'text' : 'password'}
                name='confirmPassword'
                value={confirmPassword}
                onChange={handleOnChange}
                placeholder='Confirm Password'
                className='w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-12 text-richblack-5'
              />
              <span
                onClick={() => setShowConfirmPassword(prev => !prev)}
                className='absolute right-3 top-[38px] z-[10] cursor-pointer'
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF' />
                ) : (
                  <AiOutlineEye fontSize={24} fill='#AFB2BF' />
                )}
              </span>
            </label>

            <button
              type='submit'
              className='mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900'
            >
              Reset Password
            </button>
          </form>
          <div className='mt-6 flex items-center justify-between'>
            <Link to='/login'>
              <p className='flex items-center gap-x-2 text-richblack-5'>
                <BiArrowBack /> Back To Login
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default UpdatePassword
