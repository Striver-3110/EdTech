import React, { useState } from 'react'
import HighlightText from './HighlightText'
import { HomePageExplore } from '../../../data/homepage-explore'

const tabsName = [
  'Free',
  'New to coding',
  'Most popular',
  'Skill paths',
  'Career paths'
]

export default function ExploreMore () {
  const [currentTab, setCurrentTab] = useState(tabsName[0])
  const [courses, setCourses] = useState()
  const [currentCard, setCurrentCard] = useState()

  const setMyCards = value => {
    setCurrentTab(value)
    const result = HomePageExplore.filter(course => course.tag === value)
    // const result = HomePageExplore.filter((course) => {return (course.tag === value)})
    setCourses(result[0].courses)
    setCurrentCard(result[0].courses[0].heading)
  }

  return (
    <div>
      {/* title Paragraph */}

      <div className='text-4xl font-semibold text-center'>
        Unlock the
        <HighlightText text={'Power of code'} />
      </div>

      {/* subTitle Paragraph */}
      <p className='text-center text-[] text-richblack-300 text-sm mt-3'>
        Learn to build anything you can imagine
      </p>

      {/*  courses Tabs Navigation */}
      <div className='mt-4 bg-richblack-800 flex flex-row rounded-full px-1 py-1 cursor-pointer border-richblack-100'>
        {tabsName.map((element, index) => {
          return (
            <div
              className={`text-[16px] flex flex-row items-center gap-2 ${
                currentTab === element
                  ? 'bg-richblack-900 font-medium text-richblack-5'
                  : 'text-richblack-200'
              }
            rounded-full transition-all duration-200 hover:bg-richblack-900 text-richblack-5 px-7 py-2`}
              key={index}
              onClick={() => {
                setMyCards(element)
              }}
            >
              {element}
            </div>
          )
        })}
          </div>
          

          <div className="lg:h-[150px]"></div>

          {/* course card group */}
    </div>
  )
}
