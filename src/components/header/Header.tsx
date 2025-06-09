"use client";

import React, { useEffect, useState } from 'react'
import { CiMenuBurger } from "react-icons/ci";
import { CiShoppingCart } from "react-icons/ci";
import Announcement from './Announcement'
import Link from 'next/link';
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import HeaderSearchBar from '../layout/HeaderSearchBar';
import { useShallow } from 'zustand/shallow';
import { CartStore, useCartStore } from '@/store/cart-store';


type HeaderProps = {
  user : Omit<User, 'passwordHash'> | null;
  categorySelector : React.ReactNode;
}



const Header = ({user, categorySelector} : HeaderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [prevScrollY, setPrevScrollY] = useState<number>(0)
  const router = useRouter()

  const {open, getTotalItems} = useCartStore(
    useShallow((state : CartStore)=> ({
      open: state.open,
      getTotalItems: state.getTotalItems
    }))
  )

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      router.refresh()
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

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
                  {categorySelector}
                  <Link href={""}>Sale</Link>
                 </nav>
                </div>

                <Link href={""} className='absolute left-1/2 -translate-x-1/2'>
                  <span className='text-xl sm:text-2xl font-bold tracking-tight'>
                    DEAL
                  </span>
                
                </Link>

                <div className='flex flex-1 justify-end items-center gap-2 sm:gap-4'>
                  <HeaderSearchBar/>

                  {user ? (
                    <div className='flex items-center gap-2 sm:gap-4 justify-center'>
                      <span className='text-sm text-gray-700 hidden md:block'>{user.email}</span>
                       <button className="text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-200 rounded-lg px-4 py-2" onClick={()=>handleSignOut()}>
                        Sign Out
                      </button>
                    </div>
                  ): (
                    <>
                      <Link href={`/auth/sign-in`}>Sign In</Link>
                      <Link href={`/auth/sign-up`}>Sign Up</Link>
                    </>
                  )}

                  <button onClick={()=>open()} className='text-gray-700 hover:text-gray-900 relative'>
                    <CiShoppingCart size={25}/>
                    <span className='absolute -top-1 -right-1 bg-black text-white text-[10px] sm:text-xs w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center'>{getTotalItems()}</span>
                  </button>
                </div>
              </div>
            </div>
        </div>
    </header>
  )
}

export default Header