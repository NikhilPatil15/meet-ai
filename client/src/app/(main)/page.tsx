"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
<<<<<<< HEAD

=======
>>>>>>> 4887084009be8d7f4ad43f38ae5fba8dc690a530
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
} from '@/components/index';
import { hoverItems } from '../../constants/hoverItems'
function Home() {
  return (
    <>
      {" "}
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

export default Home;
