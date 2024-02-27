import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import HighlightText from '../components/core/homepage/HighlightText'
import CTAButton from '../components/core/homepage/CTAButton'
import Banner from '../assets/Images/banner.mp4'
import CodeBlocks from '../components/core/homepage/CodeBlocks'
import ExploreMore from '../components/core/homepage/ExploreMore'
// import { FaArrowRight } from 'react-icons/fa';
import LearningLanguageSection from '../components/core/homepage/LearningLanguageSection'
import Footer from '../components/common/Footer'
import InstructorSection from '../components/core/homepage/InstructorSection'

import TimelineSection from '../components/core/homepage/TimelineSection'

export default function Home () {
  return (
    <div>
      {/* Section 1 */}
      <div className='relative mx-auto flex flex-col items-center justify-between max-w-maxContent text-white w-11/12 '>
        <Link to={'/signup'}>
          <div
            className='group mt-16 text-richblack-200 cursor - pointer
 font-bold bg-richblack-800 rounded-full p-1 transition-all duration-200 hover:scale-95'
          >
            <div className='flex flex-row items-center w-fit transition-all rounded-full gap-2  px-10 py-[5px] group-hover:bg-richblack-900'>
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>
        <div className='text-center text-4xl font-semibold mt-7 text-white'>
          Empower Your Future with
          <HighlightText text={'Coding Skills'} />
        </div>
        <div className='mt-4 w-[90%] text-richblack-300 font-bold text-lg text-center'>
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>
        <div className='flex flex-row gap-7 mt-8'>
          <CTAButton text={'Learn More'} active={true} linkto={'/signup'} />
          <CTAButton text={'Book a Demo'} active={false} linkto={'/login'} />
        </div>
        <div
          className='mx-3 my-12 bg-white 
 shadow-md '
        >
          <video muted loop autoPlay className=''>
            <source src={Banner} />
          </video>
        </div>
        {/* code Section 1*/}
        <div>
          <CodeBlocks
            position={'lg:flex-row'}
            heading={
              <div className='text-4xl font-semibold'>
                Unlock Your
                <HighlightText text={'coding potential'}></HighlightText> with
                our online course
              </div>
            }
            subheading={
              'Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you.'
            }
            ctabtn1={{
              text: 'try it yourself',
              linkto: '/signup',
              active: true
            }}
            ctabtn2={{
              text: 'learn more',
              linkto: '/login',
              active: false
            }}
            codeblock={`<<!DOCTYPE html>\n<html>\nhead><title>Example</title><linkrel="stylesheet"href="styles.css">\n/head>\n`}
            codecolor={'text-yellow-25'}
          />
        </div>
        {/**Code Section 2 */}
        <div>
          <CodeBlocks
            position={'lg:flex-row-reverse'}
            heading={
              <div className='text-4xl font-semibold'>
                Unlock Your
                <HighlightText text={'coding potential'}></HighlightText> with
                our online course
              </div>
            }
            subheading={
              'Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you.'
            }
            ctabtn1={{
              text: 'try it yourself',
              linkto: '/signup',
              active: true
            }}
            ctabtn2={{
              text: 'learn more',
              linkto: '/login',
              active: false
            }}
            codeblock={`<<!DOCTYPE html>\n<html>\nhead><title>Example</title><linkrel="stylesheet"href="styles.css">\n/head>\n`}
            codecolor={'text-yellow-25'}
          />
        </div>
        <ExploreMore />
      </div>
      {/* Section 2 */}
      <div className='bg-pure-greys-5 text-richblack-700'>
        <div className='homepage_bg h-[310px] '>
          <div className='w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto'>
            <div className='h-[150px]'></div>
            <div className='flex flex-row gap-7 text-white'>
              <CTAButton active={true} text={'Explore Full Catalog'}>
                <FaArrowRight />
              </CTAButton>
              <CTAButton
                active={false}
                text={'Learn More'}
                linkto={'/signup'}
              />
            </div>
          </div>
        </div>
        <div className='w-11/12 max-w-maxContent flex flex-col items-center justify-between mx-auto gap-7'>
          <div className='flex flex-row gap-7 mb-10 mt-[95px]'>
            <div className='text-4xl font-semibold w-[45%]'>
              Get the Skills you need for a
              <HighlightText text={'Job that is in demand'} />
            </div>
            <div className='flex flex-col gap-10 w-[40%] items-start'>
              <p className='text-[16px]'>
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </p>
              <CTAButton active={true} linkto={'/signup'} text={'Learn More'} />
            </div>
          </div>
          <TimelineSection />
          <LearningLanguageSection />
        </div>
      </div>
      {/* Section 3 */}
      <div className='w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 first-letter bg-richblack-900 text-white'>
        <InstructorSection />

        <h2 className='text-center text-4xl font-semobold mt-10'>
          review from Other Learners
        </h2>
        {/* Review Slider here */}
      </div>
      {/*Footer */}
      ;<Footer />
      {/* Footer */}
    </div>
  )
}
