"use client"
import React, { useState } from 'react';
import {disablePageScroll, enablePageScroll} from 'scroll-lock'
import Image from 'next/image';
import Link from 'next/link';
import logoMeet from '@/assests/Meet-logo.jpg'
import {navigation} from '@/constants/index' // Adjusted relative path
import Button from '../../Button';
import ButtonGradient from '@/assests/svg/ButtonGradient';
import MenuSvg from '@/assests/svg/MenuSvg'
import {HamburgerMenu} from '@/app/components/LandingPage/Design/Header'
import { Hind } from 'next/font/google';

function Navbar() {
  const [openNavigation, setOpenNavigation] = useState(false);

  const toggleNavigation = () => {
    if(openNavigation)
    {
      setOpenNavigation(false)
      enablePageScroll()
    }else{
      setOpenNavigation(true)
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if(!openNavigation) return;
    enablePageScroll();
    
    setOpenNavigation(false);
  };

  return (
    <div className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 ${openNavigation ? 'bg-n-8' : 'bg-n-8/90 backdrop-blur-sm'}`}>
      <div className='flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4'>
        <Link href="#hero" className='block w-[12rem] xl:mr-8'>
          <Image src={logoMeet} alt="Logo Meet" width={190} height={48} />
        </Link>
        <nav className={`fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent ${openNavigation ? 'flex' : 'hidden'}`}>
          <div className='relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row'>
            {navigation.map((item) => (
              <Link key={item.id} href={item.url} onClick={handleClick} className={`block relative font-code text-1xl uppercase text-n-1 transition-colors hover:text-color-1 ${item.onlyMobile ? 'lg:hidden' : ''} px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold`}>
                {item.title}
              </Link>
            ))}
          </div>
        </nav>
        <a className='button hidden mr-8 text-n-1/50 transition-colors hover:text-n-1 lg:block' href='#signup'>Sign up</a>
        <Button className={`hidden lg:flex`} href={`#login`} onClick={undefined} px={undefined}  white={undefined} >Sign in</Button>
      
        <ButtonGradient />
        <button className='ml-auto lg:hidden px-3' onClick={toggleNavigation}>
          <MenuSvg openNavigation={openNavigation} />
        </button>
      </div>
    </div>
  );
}

export default Navbar;
