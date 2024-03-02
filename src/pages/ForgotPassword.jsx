import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPasswordResetToken } from '../services/operations/authAPI'
import { Link } from 'react-router-dom'
import { BiArrowBack } from 'react-icons/bi'

//? once the forgot password is submitted
//? then the update password page will be rendered!

const ForgotPassword = () => {
  const [email, setEmail] = useState('') // Provide an initial value here
  const [emailSent, setEmailSent] = useState(false)
  const { loading } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const handleOnChange = e => {
    console.log(e.target.value)
    setEmail(e.target.value)
    // setEmail({[e.target.name]:e.target.value}) //? this will give unexpected behavior of email input!
    //? bcz we are trying to replace a parameter with an object!
  }

  const handleOnSubmit = e => {
    e.preventDefault()
    dispatch(getPasswordResetToken(email, setEmailSent))
  }
  return (
    <div className='grid min-h-[calc(100vh-3.5rem)] place-items-center '>
      {loading ? (
        <div> Loading... </div>
      ) : (
        <div className='max-w-[500px] p-4 lg:p-8'>
          <h1 className='text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5'>
            {!emailSent ? 'Reset Your Password' : 'Check Your Email'}
          </h1>
          <p className='my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100'>
            {!emailSent
              ? "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
              : `We have sent the reset email to ${email}`}
          </p>
          <form onSubmit={handleOnSubmit}>
            {!emailSent && (
              <label className='w-full'>
                <p className='mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5'>
                  Email Address <sup className='text-pink-200'>*</sup>
                </p>
                <input
                  type='email'
                  required
                  name='email'
                  value={email}
                  onChange={handleOnChange}
                  placeholder='Enter your Email'
                  className=' w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-12 text-richblack-5'
                  style={{
                    boxShadow: 'inset 0px -1px 0px rgba(255, 255, 255, 0.18)'
                  }}
                />
              </label>
            )}
            <button
              submit='submit'
              className='mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900'
            >
              {!emailSent ? 'Submit' : 'Resend Email'}
            </button>
          </form>
          <div className='mt-6 flex items-center justify-between'>
            <Link to='/login'>
              <p className='flex items-center gap-x-2 text-richblack-5'>
                <BiArrowBack /> Back to Login
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default ForgotPassword
