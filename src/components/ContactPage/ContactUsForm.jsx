import React, { useEffect, useState, useSyncExternalStore } from 'react'
import { useForm } from 'react-hook-form'
import { apiConnector } from '../../services/apiConnector'
import CountryCode from '../../data/countrycode.json'
// import { apiConnector } from '../../services/apiConnector'
import {contactUsEndpoint}  from '../../services/apis'

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful }
  } = useForm()
  const submitContactForm = async data => {
    try {
      setLoading(true)
      const res = await apiConnector(
        'POST',
        contactUsEndpoint.CONTACT_US_API,
        data
      )
      setLoading(false)
    } catch (error) {
      console.log('Error Message:', error.message)
      setLoading(false)
    }
  }
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: '',
        firstname: '',
        lastname: '',
        message: '',
        phonenumber: ''
      })
    }
  }, [reset, isSubmitSuccessful])
  return (
    <form
      className='flex flex-col lg:gap-7'
      onSubmit={handleSubmit(submitContactForm)}
    >
      <div className='flex flex-col gap-5 lg:flex-row'>
        <div className='flex flex-col gap-2 lg:w-[48%]'>
          <label htmlFor='firstname' className='label-style'>
            First Name
          </label>
          <input
            type='text'
            name='firstname'
            id='firstname'
            placeholder='Enter First Name'
            style={{
              boxShadow: 'inset 0px -1px 0px rgba(255, 255, 255, 0.18)'
            }}
            className='w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5'
            {...register('firstname', { required: true })}
          />
          {errors.firstname && (
            <span className='-mt-1 text-[12px] text-yellow-100'>
              Please enter your first name.
            </span>
          )}
        </div>
        <div className='flex flex-col gap-2 lg:w-[48%]'>
          <label htmlFor='lastname' className='label-style'>
            Last Name
          </label>
          <input
            type='text'
            name='lastname'
            id='lastname'
            placeholder='Enter last name'
            style={{
              boxShadow: 'inset 0px -1px 0px rgba(255, 255, 255, 0.18)'
            }}
            className='w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5'
            {...register('lastname')}
          />
          {errors.lastname && (
            <span className='-mt-1 text-[12px] text-yellow-100'>
              Please enter your last name.
            </span>
          )}
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <label htmlFor='email' className='label-style'>
          Email Address
        </label>
        <input
          type='email'
          name='email'
          id='email'
          placeholder='Enter email address'
          style={{
            boxShadow: 'inset 0px -1px 0px rgba(255, 255, 255, 0.18)'
          }}
          className='w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5'
          {...register('email', { required: true })}
        />
        {errors.email && (
          <span className='-mt-1 text-[12px] text-yellow-100'>
            Please enter your Email address.
          </span>
        )}
      </div>
      <div className='flex flex-col gap-2'>
        <label htmlFor='phonenumber' className='label-style'>
          Phone Number
        </label>
        <div className='flex gap-5 items-center'>
          <div className='flex w-[81px] flex-col gap-2'>
            <select
              name='countrycode'
              id='countrycode'
              placeholder='Enter first name'
              style={{
                boxShadow: 'inset 0px -1px 0px rgba(255, 255, 255, 0.18)'
              }}
              className='w-full rounded-[0.5rem] bg-richblack-800 p-[15px] text-richblack-5'
              {...register('countrycode', { required: true })}
            >
              {CountryCode.map((element, index) => {
                return (
                  <option value={element.code} key={index}>
                    {element.code} - {element.country}
                  </option>
                )
              })}
            </select>
          </div>
          <div className='flex w-[calc(100%-90px)] flex-col gap-2'>
            <input
              type='number'
              name='phonenumber'
              id='phonenumber'
              placeholder='12345 67890'
              style={{
                boxShadow: 'inset 0px -1px 0px rgba(255, 255, 255, 0.18)'
              }}
              className='w-full appearance - none
 rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5'
              {...register('phonenumber', {
                required: {
                  value: true,
                  message: 'Please enter your phone number.'
                },
                maxLength: { value: 12, message: 'Invalid Phone Number' },
                minLength: { value: 10, message: 'Invalid Phone Number' }
              })}
            />
          </div>
        </div>
        {errors.phonenumber && (
          <span className='-mt-1 text-[12px] text-yellow-100'>
            {errors.phonenumber.message}
          </span>
        )}
      </div>
      <div className='flex flex-col gap-2'>
        <label htmlFor='message' className='label-style'>
          Message
        </label>
        <textarea
          name='message'
          id='message'
          cols='30'
          rows='7'
          placeholder='Enter your message here'
          style={{
            boxShadow: 'inset 0px -1px 0px rgba(255, 255, 255, 0.18)'
          }}
          className='w-full resize-none
 rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5'
          {...register('message', { required: true })}
        />
        <button
          disabled={loading}
          type='submit'
          className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
         ${
           !loading &&
           'transition-all duration-200 hover:scale-95 hover:shadow-none'
         }  disabled:bg-richblack-500 sm:text-[16px] `}
        >
          Send Message
        </button>
      </div>
    </form>
  )
}

export default ContactUsForm
