import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Navbar from "@/components/Navbar/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedTitle from "@/components/FeaturedTitle";
import FeaturedSection from "@/components/FeaturedSection";
import Heading from "@/components/Heading";
import Review from "@/components/Review";
import { HoverEffect } from "@/components/CardHoverEffect";
import Copyright from "@/components/CopyRight";
import Footer from "@/components/Footer";
import { hoverItems } from "../data/hoverItems";



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MeetAi",
  description: "AI powered meeting",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/jpg" href="/assets/logo_meet.jpg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>MeetAi</title>
      </head>
      <body className={inter.className}>
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
        {/* <Navbar /> */}
        {/* <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
         <Button className={undefined} href={undefined} onClick={undefined} px={undefined}  white={undefined} >Something</Button>
        </div>
        <ButtonGradient /> */}
        {children}
      </body>
    </html>
  );
}
