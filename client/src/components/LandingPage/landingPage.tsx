"use client";

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
import { hoverItems } from '../../constants/hoverItems'
export default function LandingPage() {
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Navbar />
        <HeroSection />
        <FeaturedTitle />
        <FeaturedSection />
        <Heading></Heading>
        <FeaturedSection></FeaturedSection>
        <Review></Review>
        <HoverEffect items={hoverItems} />
        <Footer></Footer>
        <Copyright></Copyright>
      </div>
    </>
  );
}

