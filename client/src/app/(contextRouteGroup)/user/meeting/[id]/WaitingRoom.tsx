'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import axiosInstance from '@/utils/axios';
import { Button, Box, Typography, CircularProgress } from "@mui/material";

interface WaitingRoomProps {
 meeting:any

}

const WaitingRoom: React.FC<WaitingRoomProps> = ({meeting}) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [meetingReady, setMeetingReady] = useState(false);
  const [meetingDetails, setMeetingDetails] = useState<any>(meeting);
  const router = useRouter();




  useEffect(() => {
    const scheduledDate = dayjs(meetingDetails?.scheduledTime);

    const updateTimer = () => {
      const now = dayjs();
      const diff = scheduledDate.diff(now);

      if (diff <= 0) {
        setMeetingReady(true);
        setTimeRemaining('00:00:00');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeRemaining(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    };

    const timerInterval = setInterval(updateTimer, 1000);

    return () => clearInterval(timerInterval);
  }, [meetingDetails?.scheduledTime]);

  const handleJoinMeeting = () => {
    router.replace(`user/meeting/${meeting?.roomId.split(":")[1]}`);
  };

    return (
      <Box
        sx={{
          textAlign: "center",
          marginTop: "50px",
          color: "white",
          backgroundColor: "background.default",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
          Scheduled Meeting Waiting Room
        </Typography>
  
        {meetingReady ? (
          <Button
            onClick={handleJoinMeeting}
            variant="contained"
            sx={{
              px: 6,
              py: 3,
              fontSize: "18px",
              bgcolor: "success.main",
              "&:hover": {
                bgcolor: "success.dark",
              },
            }}
          >
            Join Meeting
          </Button>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h6" sx={{ mb: 3, color: "text.secondary" }}>
              Meeting starts in:
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                bgcolor: "background.paper",
                boxShadow: 3,
                mb: 3,
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: "bold", color: "text.primary" }}>
                {timeRemaining.split(":")[0]}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: "bold", color: "text.primary" }}>: </Typography>
              <Typography variant="h3" sx={{ fontWeight: "bold", color: "text.primary" }}>
                {timeRemaining.split(":")[1]}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: "bold", color: "text.primary" }}>: </Typography>
              <Typography variant="h3" sx={{ fontWeight: "bold", color: "text.primary" }}>
                {timeRemaining.split(":")[2]}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    );
  };





export default WaitingRoom;
