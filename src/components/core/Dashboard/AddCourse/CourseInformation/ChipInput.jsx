import React from 'react'
import { MdClose } from 'react-icons/md'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
// import { validate } from '../../../../../../Server/models/User';
import {toast} from 'react-hot-toast';

const ChipInput = ({
  name,
  setValue,
  getValues,
  errors,
  label,
  placeholder,
  register
}) => {
  const { editCourse, course } = useSelector(state => state.course)
  //? now we have the course

  //? lets take another state variable called chips which is an array to store all the tags that users enter
  const [chips, setChips] = useState([])

  //?when your enters tag name and press enter or , key we will update chips array by appending that new chip
  const handleKeyDown = event => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      const chipValue = event.target.value.trim()

      if (chipValue && !chips.includes(chipValue)) {
        const newChips = [...chips, chipValue]
        setChips(newChips)
        event.target.value = ''
      }
      else{
        toast.error('Tag is already added!')
      }
    }
  }
  //? this will be helpful in the parent component to interact with the db and store the latest chips using api call by fetching the values using the name attribute
  useEffect(() => {
    setValue(name, chips)
  }, [chips])

  //? when we open the course in the edit mode
  //? then it will fetch existing tags and will set the chips value to the same
  //?
  useEffect(() => {
    if (editCourse) {
      setChips(course?.tag)
    }
    register(name, { required: true, validate: value => value.length > 0 })
  })

  const handleDeleteChip = index => {
    const newChips = chips.filter((_, idx) => idx !== index)
    setChips(newChips)
  }

  return (
    <div className='flex flex-col space-y-2'>
      <label htmlFor={name} className='text-sm text-richblack-5'>
        {label}
        <sup className='text-pink-200'>*</sup>
      </label>

      <div className='flex w-full flex-wrap gap-y-2'>
        {chips &&
          chips.map((chip, index) => (
            <div
              key={index}
              className='m-1 flex items-center rounded-full bg-yellow-800 px-2 py-1 text-sm text-richblack-5'
            >
              {chip}
              <button
                className='ml-2 focus:outline-none'
                onClick={() => handleDeleteChip(index)}
              >
                <MdClose className='text-sm' />{' '}
              </button>
            </div>
          ))}
        <input
          type='text'
          id={name}
          name={name}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className='form-style w-full'
        />
      </div>
      {errors[name] && 
      (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}

export default ChipInput
