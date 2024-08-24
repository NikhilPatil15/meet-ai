'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import HomeCard from '@/components/DashBoard/Homepage/HomeCard';
import { StateCardData } from '@/constants/StateCardData';
import MeetingModal from './MeetingModal';

const MeetingTypeList = () => {
  const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>(undefined);
  const [meetingDate, setMeetingDate] = useState<string>('');
  const [meetingTime, setMeetingTime] = useState<string>('');

  const handleCardClick = (state: 'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting') => {
    setMeetingState(state);
    if (state === 'isInstantMeeting') {
      createMeeting();
    }
  };

  const createMeeting = () => {
    const now = new Date();
  
    // Format the date and time as desired
    const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions: Intl.DateTimeFormatOptions = { hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
  
    const formattedDate = now.toLocaleDateString('en-US', dateOptions);
    const formattedTime = now.toLocaleTimeString('en-US', timeOptions);
  
    // Update state with the formatted date and time
    setMeetingDate(formattedDate);
    setMeetingTime(formattedTime);
  };

  return (
    <Box className="grid grid-cols-1 gap-3 md:gap-3 lg:gap-4 md:grid-cols-2 xl:grid-cols-4">
      {StateCardData.map((item, index) => (
        <HomeCard
          key={index}
          img={item.img}
          title={item.title}
          description={item.description}
          iconbg={item.iconbg}
          iconColor={item.iconColor}
          handleClick={() => handleCardClick(item.isState)}
        />
      ))}
      <MeetingModal 
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      >
        <div>
          <p id="meetingDate">Date: {meetingDate}</p>
          <p id="meetingTime">Time: {meetingTime}</p>
        </div>
      </MeetingModal>
    </Box>
  );
};

export default MeetingTypeList;
