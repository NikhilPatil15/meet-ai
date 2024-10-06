"use client";
import React, { useState } from "react";
// Ensure correct path
import TopBar from "@/components/DashBoard/Slidebar/TopBar"; // Ensure correct path
import HomePage from "@/components/DashBoard/Homepage/HomePage"; // Ensure correct path
import EditProfile from '@/components/DashBoard/EditProfile/EditProfile';

function Home() {
  return (
    <section className="flex size-full flex-col gap-5 text-white h-full">
<<<<<<< HEAD
      <div className="h-[303px] w-full rounded-[20px] bg-hero bg-cover">
        <HomePage />
=======
       <div className="h-[303px] w-full rounded-[20px] bg-hero bg-cover">
     <HomePage/>
     {/* <EditProfile></EditProfile> */}
>>>>>>> 9e989f44a3f1eb3212549e576795bfee5a701965
      </div>
    </section>
  );
}

export default Home;
