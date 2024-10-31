import React, { useEffect, useState } from "react";
import MeetingCard from "../meetingCard";
import { UpcomingMeet } from "@/constants/UpcomingMeet";
import { Box } from "@mui/material";
import CardSkeleton from "../Homepage/CardSkeleton";
import axiosInstance from "@/utils/axios";


const Upcoming = () => {
  const [loading, setLoading] = useState(true);
  const [upcoming, setUpcoming] = useState<any>(null);

  const fetchUpcomingMeetings = async() => {
    try {
      setLoading(true);
      const res: any = await axiosInstance.get("/user/get-scheduled-meetings");
      console.log(res.data.data);
      setUpcoming(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // const loadContent = async () => {
    //   await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay of 1 second
    //   setLoading(false);
    // };

    // loadContent();
    fetchUpcomingMeetings()
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
          : upcoming.map((meeting, index) => (
              <Box
                key={index}
                mb="20px"
                p="10px"
                className="h-full bg-gray-800 rounded-xl shadow-lg flex flex-col justify-between"
              >
                <MeetingCard
                  title={meeting.title}
                  buttonText="Join Meet"
                  handleClick={() => {}}
                  type={meeting.type}
                  roomId={meeting.roomId}
                  description={meeting.description}
                  participants={meeting.participants}
                  scheduledTime={meeting.scheduledTime}
                  // icon={meeting.icon}
                  // avatarCount={1}
                  // participants
                  // buttonIcon1
                />
              </Box>
            ))}
      </Box>
    </div>
  );
};

export default Upcoming;
