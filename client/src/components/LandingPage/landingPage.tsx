"use client";

import { useState, useEffect } from 'react';
import {
  Navbar,
  Button,
  HeroSection,
  FeaturedSection,
  FeaturedTitle,
  Footer,
  Heading,
  Review,
  HoverEffect,
  Copyright,
} from '../index';
import { hoverItems } from '../../constants/hoverItems';
import Grid from './Featured/Grid';

export default function LandingPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      await new Promise(resolve => setTimeout(resolve, 4000)); // Delay of 2 seconds
      setLoading(false);
    };

    loadContent();

    // This timeout will move the loader out of view after 3.2 seconds
    setTimeout(() => {
      const loader = document.querySelector('.loader-container');
      if (loader && loader instanceof HTMLElement) {
        loader.style.top = "-100%";
      }
    }, 4000);
  }, []);

  return (
    <>
      {loading ? (
        <div className="loader-container">
         
          <h1 className='head fy'>MeetAi</h1>
          <h1 className='head sy'>AI-Powered</h1>
          <h1 className='head ty'>Meeting</h1>
          <h1 className='head ffy'>Platform</h1>
          
        </div>
      ) : (
        <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
          <Navbar />
          <HeroSection />
          <FeaturedTitle />
          <Grid />
          <Heading />
          <FeaturedSection />
          <Review />
          <HoverEffect items={hoverItems} />
          <Footer />
          <Copyright />
        </div>
      )}
    </>
  );
}
