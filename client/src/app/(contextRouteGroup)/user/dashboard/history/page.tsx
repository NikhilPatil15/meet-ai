'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';

interface Meeting {
  _id: string;
  title: string;
  description: string;
  status: string;
  roomId: string;
  hostDetails: {
    _id: string;
    userName: string;
    fullName: string;
    email: string;
  };
  guestDetails: Array<unknown>;
  userDetails: Array<unknown>;
  updatedAt: string;
}

export default function MeetingHistory() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchMeetingsHistory = async () => {
    try {
      const response = await axios.get<Meeting[]>('http://localhost:5000/api/v1/user/get-meeting-history');
      console.log("API Response: ", response.data); // Log the response
      setMeetings(response.data); // Ensure this is an array
    } catch (error) {
      console.error("Error fetching meeting history:", error);
      setError("Failed to fetch meeting history.");
    }
  };

  useEffect(() => {
    fetchMeetingsHistory();
  }, []);

  return (
    <div>

    </div>
  );
}
