"use client";
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Image from 'next/image';
import axios from 'axios';

import { UpcomingMeet, UpcomingMeet2 } from "@/constants/UpcomingMeet";
import MeetingCard from '@/components/DashBoard/meetingCard';
import MeetingTypeList from '@/components/DashBoard/Homepage/MeetingTypeList';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useUserContext } from '@/Context/userContext';
import CardSkeleton from '@/components/DashBoard/Homepage/CardSkeleton'; // Ensure this import is correct
import CardSkeleton2 from '@/components/DashBoard/Homepage/CardSkeleton2'; // Import the updated CardSkeleton2

interface User {
  oAuthId: string;
  fullName: string;
  userName: string;
}

const HomePage: React.FC = () => {
  const { token } = useUserContext();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay of 1 second
      setLoading(false);
    };

    loadContent(); // This should be called immediately after the function definition
  }, []); // Add an empty dependency array to run this effect once

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/user/get-user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log("Response: ", response.data.data);
        setUser(response.data.data.FetchedUser);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    }

    if (token) {
      fetchUserDetails();
    }
  }, [token]);

  console.log("User: ", user);

  return (
    <div className="lg:ml-[190px] p-3 lg:pl-16 md:pl-28 sm:pl-28">
      <h1 className='font-semibold text-lg mb-4'>
        {loading ?  <SkeletonTheme baseColor="#313131" highlightColor="#525252"><Skeleton width={100} /></SkeletonTheme> : `Hello, ${user?.userName}`}
      </h1>
      
      {/* Top Bar */}
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <h1 className="mb-6 text-3xl font-bold">Meetings</h1>
      </Box>

      {/* Meeting Types */}
      <MeetingTypeList />

      {/* Upcoming Meetings */}
      <Box id="upcoming" display="flex" alignItems="center" justifyContent="space-between" className="mt-12">
        <h1 className="mb-4 text-3xl font-bold">Upcoming</h1>
      </Box>

      <Box
        mt="25px"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))
        ) : (
          UpcomingMeet.map((meeting, index) => (
            <Box
              key={index}
              mb="20px"
              p="10px"
              className="bg-gray-800 rounded-xl shadow-lg cursor-pointer flex flex-col justify-between"
            >
              <MeetingCard
                title={meeting.title}
                date={meeting.date}
                icon={meeting.icon}
                buttonText="Join Meet"
                handleClick={() => {}}
                avatarCount={1}
              />
            </Box>
          ))
        )}
      </Box>

      {/* Meeting History */}
      <Box id="history" display="flex" alignItems="center" justifyContent="space-between" className="mt-12">
        <h1 className="mb-4 text-3xl font-bold">History</h1>
      </Box>

      <Box
        mt="25px"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4"
      >
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <CardSkeleton2 key={index} />
          ))
        ) : (
          UpcomingMeet2.map((meeting, index) => (
            <Box
              key={index}
              mb="20px"
              p="15px"
              className="bg-gray-800 rounded-xl shadow-md flex flex-col justify-between"
            >
              <Box display="flex" alignItems="center" gap={3}>
                <Image src={meeting.icon} alt="icon" width={28} height={28} />

                <div className="flex flex-col gap-1">
                  <h4 className="text-xl font-bold text-white">{meeting.title}</h4>
                  <p className="text-sm text-gray-400">{meeting.date}</p>
                </div>
              </Box>
              <p className="self-end mt-auto text-sm py-1 px-3 text-gray-400 bg-gray-700 rounded-lg">
                Previous Meeting
              </p>
            </Box>
          ))
        )}
      </Box>
    </div>
  );
};

export default HomePage;
