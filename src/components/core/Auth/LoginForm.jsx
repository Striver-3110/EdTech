import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { useDispatch } from 'react-redux'
import { login } from '../../../services/operations/authAPI'

export default function LoginForm () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  //? initializing login form data

  const [formData, setFormData] = useState({
    email: 'pjay19520@gmail.com ',
    password: '9099285709'
  })
  //? destructuring form data
  const { email, password } = formData

  //**************************************************handling on-change event**************************************************************

  const handleOnChange = event => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [event.target.name]: event.target.value
    }))
  }
  //!*********************************************************** handling submit event **********************************************

  const handleOnSubmit = event => {
    event.preventDefault()
    //? the dispatch function, which is typically associated
    //? with state management in libraries like Redux, as part
    //? of asynchronous action creators.The dispatch function is
    //? used to send actions to the Redux store, which then triggers
    //? the corresponding reducers to update the state.

    dispatch(login(email, password, navigate))
  }
  return (
    <form
      onSubmit={handleOnSubmit}
      className='mt-6 flex flex-col w-full gap-y-4'
    >
      <label className='w-full'>
        <p className='mb-1 text-[0.875rem] text-richblack-5'>
          Email Address <sup className='text-pink-200'>*</sup>
        </p>
        <input
          type='text'
          required
          name='email'
          value={email}
          onChange={handleOnChange}
          placeholder='Enter Email Address'
          style={{
            boxShadow: 'inset 0px -1px 0px rgba(255,255,255,0.18)'
          }}
          className='w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5'
        />
      </label>
      <label className='relative'>
        <p className='mb-1 text-[-.875rem] leading-[1.375rem] text-richblack-5'>
          Password<sup className='text-pink-200'>*</sup>
        </p>
        <input
          type={showPassword ? 'text' : 'password'}
          required
          name='password'
          value={password}
          onChange={handleOnChange}
          placeholder='Enter Password'
          style={{
            boxShadow: 'inset 0px -1px 0px rgba(255, 255, 255, 0.18)'
          }}
          className='w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-12 text-richblack-5'
        />
        <span
          onClick={() => setShowPassword(prev => !prev)}
          className='absolute right-3 top-[-38px] z-[10] cursor-pointer'
        >
          {showPassword ? (
            <AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF' />
          ) : (
            <AiOutlineEye fontSize={24} fill='#AFB2BF' />
          )}
        </span>{' '}
        <Link to='/forgot-password'>
          <p className='mt-1 ml-auto max-w-max text-xs text-blue-100'>
            Forgot Password
          </p>
        </Link>
      </label>
      <button
        type='submit'
        className='mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900'
      >
        Sign In
      </button>
    </form>
  )
}
