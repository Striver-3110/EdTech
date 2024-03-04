import OtpInput from 'react-otp-input'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { BiArrowBack } from 'react-icons/bi'
import { sendOTP, signUp } from '../services/operations/authAPI'
import { RxCountdownTimer } from 'react-icons/rx'
import { useNavigate } from 'react-router-dom'

const VerifyEmail = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // const [otp, setOtp] = useState('');
  // you might have question like!
  // ? from where this signupData will come?
  // here is the answer:
  // signupData is store component
  // which is created in the slice
  // after submitting the components/core/Auth/SignupForm.jsx we are setting this variable to
  // the data filled int he fom
  // and that will be used here!
  const { signupData, loading } = useSelector(state => state.auth)

  // when this page renders for the first time
  // we have to check weather the slice / store contains
  // signup data or not

  useEffect(() => {
    if (!signupData) {
      // the path given in navigate should match with path given in app.js
      navigate('/signup')
    }
  })

  const [otpValue, setOtpValue] = useState('')
  //? one more thing!
  //? there is no explicit need to handle setOtpValue in OtpInput component
  //? as it internally handles it!
  //   const { loading } = useSelector(state => state.auth)

  const handleVerifyAndSignup = e => {
    e.preventDefault()
    //! wasted 4 hours for solving the silly mistake!!
    // done at destructuring the signupData values
    // it does not contain otp
    // and i was destructuring it🥲�    // so the correct way of doing it
    // is given below
    //   const { email, firstName, lastName, password, confirmPassword, accountType ,otp} =
    // signupData
    // destructuring updated from above to below

    const {
      email,
      firstName,
      lastName,
      password,
      confirmPassword,
      accountType
    } = signupData
    console.log('otp at the verifyEmail', otpValue)
    dispatch(
      signUp({
        email,
        firstName,
        lastName,
        password,
        confirmPassword,
        accountType,
        otp: otpValue,
        navigate
      })
    )
    // setSignupData({
    //   email: '',
    //   firstName: '',
    //   lastName: '',
    //   password: '',
    //   confirmPassword: '',
    //   accountType: '',
    //   otp: '',
    //   navigate: ''
    // })
  }
  //   const handleOnChange = e => {
  //     setOtp(e.target.value)
  //   }
  return (
    <div className='min-h-[calc(100vh-3.5rem)] grid place-items-center '>
      {loading ? (
        <div className='spinner'> Loading...</div>
      ) : (
        <div className='max-w-[500px] p-4 lg:p-8'>
          <h1 className='text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]'>
            Verify Email
          </h1>
          <p className='text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100'>
            A verification code has been sent to you. Enter the code below
          </p>
          <form onSubmit={handleVerifyAndSignup}>
            <OtpInput
              value={otpValue}
              onChange={setOtpValue}
              numInputs={6}
              renderInput={props => (
                <input
                  {...props}
                  placeholder='-'
                  style={{
                    boxShadow: 'inset 0px -1px 0px rgba(255, 255, 255, 0.18)'
                  }}
                  className='w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50'
                />
              )}
              containerStyle={{
                justifyContent: 'space-between',
                gap: '0 6px'
              }}
            />
            <button
              type='submit'
              className='w-full bg-yellow-50 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900'
            >
              Verify Email
            </button>
          </form>
          <div className='mt-6 flex items-center justify-between'>
            <Link to='/signup'>
              <p className='text-richblack-5 flex items-center gap-x-2'>
                <BiArrowBack /> Back To Signup
              </p>
            </Link>
            <button
              className='flex items-center text-blue-100 gap-x-2'
              onClick={() => dispatch(sendOTP(signupData.email))}
            >
              <RxCountdownTimer />
              Resend it
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default VerifyEmail
