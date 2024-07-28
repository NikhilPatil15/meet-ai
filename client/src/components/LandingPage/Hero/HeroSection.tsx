"use client";
import React, { useRef } from 'react';
import { TypewriterEffect } from '../ui/typewriter-effect';
import { Button } from '../ui/moving-border';
import Link from 'next/link';
import Image from 'next/image'; // Import Image from next/image
import image from '@/assets/bentohero.jpg';
import bgcimage from '@/assets/hero-background.jpg'; // Corrected path to image
import { BackgroundCircles, BottomLine, Gradient } from '../Design/Hero';
import { ScrollParallax } from 'react-just-parallax';

function HeroSection() {
  const parallaxRef = useRef(null);
  const words = [
    { text: "Unlock" },
    { text: "Boundless" },
    { text: "Connections" },
    { text: "with" },
    { text: "Meet Ai", className: "bg-slateblue-200 text-blue-500 dark:text-blue-500" },
  ];

  return (
    <div className="pt-[6rem] lg:pt-[4rem] xl:pt-[11rem]" id="hero"  >
      <div className="container relative">
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[4rem] md:mb-20 lg:mb-[6rem]">
          <TypewriterEffect words={words} className="h1 text-white text-2xl md:text-3xl lg:text-3xl" />
          <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8 text-base md:text-lg lg:text-xl">
            Room Video Calls make it easy to connect with people, no matter how far apart you are. Whether its chatting with friends, working with colleagues, or sharing special moments with family.
          </p>
          <div className="mt-6">
            <Link href={'/courses'}>
              <Button className="bg-slateblue-200 text-white border border-darkslateblue-300 hover:bg-slateblue-300 hover:border-darkslateblue-400 py-2 px-4 rounded-md flex items-center justify-center">
                Get Started for free
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24">
          <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
            <div className="relative bg-n-8 rounded-[1rem]">
              <div className="h-[1.7rem] bg-n-10 rounded-t-[0.9rem]" />
              <div className="aspect-[90 / 68] rounded-b-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1232/900]">
                <Image 
                  src={image} 
                  alt="Meet" 
                  objectFit="cover" 
                  className="rounded-[1rem] w-full" 
                  width={1024}
                  height={790}
                />
                
                <ScrollParallax isAbsolutelyPositioned>
                  <ul className="hidden absolute -left-[5.5rem] bottom-[7.5rem] px-1 py-1 bg-n-9/40 backdrop-blur border border-n-1/10 rounded-2xl xl:flex">
                  </ul>
                </ScrollParallax>
              </div>
            </div>
            <Gradient />
          </div>
          <div className="absolute -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[38%] md:w-[109%] lg:-top-[45%]">
            <Image 
              src={bgcimage} 
              alt="hero" 
              objectFit="cover" 
              className="rounded-[1rem] w-full" 
              width={4440}
              height={3800}
            />
          </div>
         
        </div>
      </div>
      <BottomLine></BottomLine>
    </div>
  );
}

export default HeroSection;
