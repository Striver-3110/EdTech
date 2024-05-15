// import React from 'react'
import { Link, matchPath } from 'react-router-dom'
import logo from '../../assets/Logo/Logo-Full-Light.png'
import { NavbarLinks } from '../../data/navbar-links'
import { IoIosArrowDropdownCircle } from 'react-icons/io'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { apiConnector } from '../../services/apiConnector'
import { categories } from '../../services/apis'
import { useEffect, useState } from 'react'
import ProfileDropDown from '../core/Auth/ProfileDropDown'
import {BsChevronDown} from 'react-icons/bs'
// import { useEffect } from 'react'

const subLinks = [
  {
    title: 'python',
    link: '/catalog/python'
  },
  {
    title: 'web dev',
    link: '/catalog/web-development'
  }
]

export default function Navbar () {
  let { token } = useSelector(state => state.auth)
  const { user } = useSelector(state => state.profile)
  const { totalItems } = useSelector(state => state.cart)
  const location = useLocation()

  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)



  useEffect(()=>{
    const fetchSubLinks = async () => {
      try {
        const result = await apiConnector('GET', categories.CATEGORIES_API)
        console.log('Printing sub-links result: ', result.data.allCategories)
        setSubLinks(result?.data?.allCategories)
      } catch (error) {
        console.log('could not fetch the category list'+error)

      }
    }
    fetchSubLinks()
  },[])
  // const fetchSubLinks = async () => {
  //   try {
  //     const result = await apiConnector('GET', categories.CATEGORIES_API)
  //     console.log('Printing sublinks result: ', result)
  //     setSubLinks(result.data)
  //   } catch (error) {
  //     console.log('could not fetch the category list')
  //   }
  // }
  // useEffect(() => {
  //   // fetchSubLinks()
  // })
  const matchRoute = route => {
    return matchPath({ path: route }, location.pathname)
  }
  return (
    //   Parent div
    <div className='flex h-14 items-center bg-richblack-900 justify-center border-b-[1px] border-b-richblack-700'>
      {/* nav container div */}
      <div className='flex w-11/12 max-w maxContent items-center justify-between'>
        {/* Logo  Image */}
        <Link to='/'>
          <img
            src={logo}
            width={160}
            loading='lazy'
            height={42}
            alt='brand-logo'
          />
        </Link>

        {/* Navigation Links */}
        <nav>
          <ul className='flex gap-x-6 text-richblack-25'>
          {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      <p>{link.title}</p>
                      <BsChevronDown />
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : subLinks.length ? (
                          <>
                            {subLinks
                              // ?.filter(
                              //   (subLink) => subLink?.courses?.length > 0
                              // )
                              ?.map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                  key={i}
                                >
                                  <p>{subLink.name}</p>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        {/* Login/signup/dashbord */}

        <div className='flex gap-x-4 items-center'>
          {user && user?.accountType !== 'Instructor' && (
            <Link to='/dashboard/cart' className='relative'>
              <AiOutlineShoppingCart />
              {totalItems > 0 && <span>{totalItems}</span>}
            </Link>
          )}

          {token === null && (
            <Link to={'/login'}>
              <button className='border border-richblue-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md '>
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to={'/signup'}>
              <button className='border border-richblue-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md '>
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropDown />}
          {/* //!! profile dropdown is yet to code */}
        </div>
      </div>
    </div>
  )
}
