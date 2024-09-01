"use client";
import React, { useState } from "react";
// Ensure correct path
import TopBar from "@/components/DashBoard/Slidebar/TopBar"; // Ensure correct path
import HomePage from "@/components/DashBoard/Homepage/HomePage"; // Ensure correct path

function Home() {
  return (
    <section className="flex size-full flex-col gap-5 text-white h-full">
      <div className="h-[303px] w-full rounded-[20px] bg-hero bg-cover">
        <HomePage />
      </div>
    </section>
  );
}

export default Home;
