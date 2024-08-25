"use client";
import React from 'react';
import { Box } from '@mui/material';
import Image from 'next/image';

import { UpcomingMeet, UpcomingMeet2 } from "@/constants/UpcomingMeet";
import MeetingCard from '@/components/DashBoard/meetingCard';
import MeetingTypeList from '@/components/DashBoard/Homepage/MeetingTypeList';
import TopBar from '../Slidebar/TopBar';

const HomePage: React.FC = () => {
  return (
    <div className="lg:ml-[190px] sm:pl-20 p-6">
      {/* Top Bar */}
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <h1 className="mb-6 text-3xl font-bold">Meetings</h1>
      </Box>

      {/* Meeting Types */}
      <MeetingTypeList />

      {/* Upcoming Meetings */}
      <Box display="flex" alignItems="center" justifyContent="space-between" className="mt-12">
        <h1 className="mb-4 text-3xl font-bold">Upcoming</h1>
      </Box>

      <Box
        mt="25px"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {UpcomingMeet.map((meeting, index) => (
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
        ))}
      </Box>

      {/* Meeting History */}
      <Box display="flex" alignItems="center" justifyContent="space-between" className="mt-12">
        <h1 className="mb-4 text-3xl font-bold">History</h1>
      </Box>

      <Box
        mt="25px"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4"
      >
        {UpcomingMeet2.map((meeting, index) => (
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
        ))}
      </Box>
    </div>
  );
};

export default HomePage;
