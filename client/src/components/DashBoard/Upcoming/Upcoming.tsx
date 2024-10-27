import React, { useEffect, useState } from 'react'
import MeetingCard from '../meetingCard'
import { UpcomingMeet } from '@/constants/UpcomingMeet'
import { Box } from '@mui/material'
import CardSkeleton from '../Homepage/CardSkeleton'

const Upcoming = () => {
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay of 1 second
      setLoading(false);
    };

    loadContent();
  }, []);
  return (
    <div>
      {/* Upcoming Meetings */}
      <Box
        id="upcoming"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        className="mt-12"
      >
        <h1 className="mb-4 text-3xl font-bold">Upcoming</h1>
      </Box>

      <Box
        mt="25px"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))
          : UpcomingMeet.map((meeting, index) => (
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
    </div>
  )
}

export default Upcoming
