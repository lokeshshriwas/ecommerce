"use client";

import React, { useEffect, useState } from 'react'
import { CiMenuBurger } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import { CiShoppingCart } from "react-icons/ci";
import Announcement from './Announcement'
import Link from 'next/link';

const Header = () => {
  const [isOpen, setIsOpen] = useState<Boolean>(true);
  const [prevScrollY, setPrevScrollY] = useState<number>(0)

  useEffect(()=>{
    const handleScroll = ()=>{
      const currentScroll = window.scrollY
      const scrolledUp = currentScroll < prevScrollY

      if(scrolledUp){
        setIsOpen(true)
      } else if (currentScroll > 100){
        setIsOpen(false)
      }

      setPrevScrollY(currentScroll)
    }

    setPrevScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)

    return ()=>{
      window.removeEventListener('scroll', handleScroll)
    }
  }, [prevScrollY])

  return (
    <header className='w-full sticky top-0 z-50 text-gray-700'>
        <div className={`w-full transform transition-transform duration-300 ease-in-out ${isOpen? 'translate-y-0' : '-translate-y-full' }`}>
            <Announcement/>
            <div className='w-full flex justify-between items-center py-3 sm:py-4 bg-white/80 shadow-sm border-b border-gray-100 backdrop-blur-sm'>
              <div className='flex justify-between items-center container mx-auto px-8'>
                <div className='flex flex-1 justify-start items-center gap-4 sm:gap-6'>
                 <button className='text-gray-700 hover:text-gray-900 md:hidden'>
                    <CiMenuBurger size={25}/>
                 </button>

                 <nav className='hidden md:flex gap-4 lg:gap-6 text-sm font-medium'>
                  <Link href={""}>Shop</Link>
                  <Link href={""}>New Arrivals</Link>
                  <Link href={""}>Sale</Link>
                 </nav>
                </div>

                <Link href={""}>DEAL</Link>

                <div className='flex flex-1 justify-end items-center gap-2 sm:gap-4'>
                  <button className='text-gray-700 hover:text-gray-900 hidden sm:block'>
                    <CiSearch size={25}/>
                  </button>

                  <Link href={'/auth/sign-in'}>Sign In</Link>
                  <Link href={'/auth/sign-up'}>Sign Up</Link>

                  <button className='text-gray-700 hover:text-gray-900 relative'>
                    <CiShoppingCart size={25}/>
                    <span className='absolute -top-1 -right-1 bg-black text-white text-[10px] sm:text-xs w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center'>0</span>
                  </button>
                </div>
              </div>
            </div>
        </div>
    </header>
  )
}

export default Header