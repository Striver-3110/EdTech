import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Pagination } from "swiper"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"

export default function CourseSlider({courses}) {
    console.log("courses length in courseSlider:.........",courses)
  return (
    <>
    {
        courses?.length ? 
        (

            <Swiper
            slidesPerView={1}
            spaceBetween={25}
            loop={true}
            modules={[FreeMode, Pagination]}
            breakpoints={{
              1024: {
                slidesPerView: 3,
              },
            }}
            className="max-h-[30rem]"
            >
                {
                    courses.map((course,i)=>{
                        return <SwiperSlide key={i}>
                            {/* TODO:! course Card to be implemented*/}
                            {/* img for testing purpose */}
                            <img src={course?.thumbnail} alt="" />
                        </SwiperSlide>
                    })
                }

            </Swiper>
        ): <p className="text-xl text-richblack-5">No Course Found</p>
    }

    </>
  )
}
