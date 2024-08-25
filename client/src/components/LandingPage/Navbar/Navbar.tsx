"use client";
import React, { useState } from 'react';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import Image from 'next/image';
import Link from 'next/link';
import meetai from '@/assets/meetai.jpg';
import { navigation } from '@/constants/navigationItems'; // Adjusted relative path
import ButtonGradient from '@/assets/svg/ButtonGradient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const [openNavigation, setOpenNavigation] = useState(false);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;
    enablePageScroll();
    setOpenNavigation(false);
  };

  return (
    <div className="relative">
      <div className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 transition-all duration-300 ${openNavigation ? 'bg-black/50' : 'bg-black/90 backdrop-blur-sm'}`}>
        <div className='flex items-center px-5 lg:px-7.5 xl:px-10 py-4'>
          <Link href="#hero" className='block w-[12rem] xl:mr-8'>
            <Image src={meetai} alt="Logo Meet" width={190} height={48} />
          </Link>

          {/* Navigation for Larger Devices */}
          <div className='hidden lg:flex flex-grow justify-center space-x-8'>
            {navigation.map((item) => (
              !item.onlyMobile && (
                <Link key={item.id} href={item.url} className={`relative text-[16px] uppercase text-n-1 transition-colors hover:text-color-1 ${item.onlyMobile ? 'lg:hidden' : ''} px-6 py-6 md:py-8 lg:text-xs lg:font-semibold font-roboto font-normal`}>
                  {item.title}
                </Link>
              )
            ))}
          </div>

          {/* Buttons for Larger Devices */}
          <div className='hidden lg:flex items-center space-x-4 ml-auto'>
            <Link className='button text-n-1/50 transition-colors hover:text-n-1' href='#signup'>Sign up</Link>
            <button className="font-semibold whitespace-nowrap leading-none transition duration-300 ease-in-out focus:outline-none text-sm px-6 py-3 rounded-lg bg-primary-gradient text-white hover:text-white/80 hover:shadow-md hover:shadow-brand-purple-500/80 flex items-center space-x-2">
              <span>Sign in</span>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                <path fillRule="evenodd" clipRule="evenodd" d="M8.366 17.648a1.2 1.2 0 0 1 0-1.696L12.318 12 8.366 8.048a1.2 1.2 0 1 1 1.697-1.696l4.8 4.8a1.2 1.2 0 0 1 0 1.696l-4.8 4.8a1.2 1.2 0 0 1-1.697 0Z" fill="currentColor"></path>
              </svg>
            </button>
          </div>

          <ButtonGradient />

          <button aria-label="Toggle Navigation" className='ml-auto lg:hidden px-3 relative z-10' onClick={toggleNavigation}>
            <FontAwesomeIcon icon={openNavigation ? faTimes : faBars} className={`text-gray-600 transition-transform duration-300 ${openNavigation ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Overlay and Menu */}
      <div className={`fixed inset-0 z-40 transition-opacity duration-300 ${openNavigation ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {openNavigation && (
          <div className='absolute inset-0 bg-black/80' onClick={handleClick}></div>
        )}
        <nav className={`fixed top-0 left-0 right-0 bottom-0 bg-black/80 flex flex-col items-center justify-center transition-transform duration-500 ease-in-out ${openNavigation ? 'translate-x-0' : 'translate-x-full'} z-50`}>
          <div className='flex flex-col items-center'>
            {navigation.map((item) => (
              <Link key={item.id} href={item.url} onClick={handleClick} className={`block text-[16px] uppercase text-n-1 transition-colors hover:text-color-1 ${item.onlyMobile ? 'lg:hidden' : ''} px-6 py-6 md:py-8 font-roboto font-normal`}>
                {item.title}
              </Link>
            ))}
            <Link href='#signup' className='text-xl uppercase text-n-1 transition-colors hover:text-color-1 py-6'>
              Sign up
            </Link>
            <button className='text-xl uppercase bg-primary-gradient text-white px-6 py-3 rounded-lg hover:text-white/80'>
              Sign in
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
