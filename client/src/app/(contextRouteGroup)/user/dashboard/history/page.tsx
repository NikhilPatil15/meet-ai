"use client"; // Ensure this component runs in client-side rendering
import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Image from "next/image";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import upcoming from "@/assets/icons/upcoming.svg";
import axiosInstance from "@/utils/axios";

// Define interfaces for the data structure
interface HostDetails {
  _id: string;
  userName: string;
  fullName: string;
  email: string;
}

interface Meeting {
  _id: string;
  title: string;
  description: string;
  status: string;
  roomId: string;
  hostDetails: HostDetails;
  guestDetails: Array<unknown>;
  userDetails: Array<unknown>;
  updatedAt: string;
}

export default function MeetingHistory() {
  const [meetings, setMeetings] = useState<Meeting[]>([]); // State to hold meeting data
  const [error, setError] = useState<string | null>(null); // State for error messages

  const fetchMeetingsHistory = async () => {
    try {
      const response = await axiosInstance.get('http://localhost:5000/api/v1/user/get-meeting-history');
      console.log("API Response: ", response.data); // Log the API response
      
      // Access the meetings array from the response and set it in state
      setMeetings(response.data.data); // Make sure to use response.data.data
    } catch (error) {
      console.error("Error fetching meeting history:", error);
      setError("Failed to fetch meeting history."); // Set error message on failure
    }
  };

  useEffect(() => {
    fetchMeetingsHistory(); // Fetch meeting history on component mount
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        padding: 3,
        backgroundColor: "#1c1c1c",
      }}
    >
      {error ? (
        <Typography variant="body1" sx={{ color: "#fff" }}>
          {error} {/* Display error message */}
        </Typography>
      ) : meetings.length > 0 ? (
        meetings.map((meeting) => (
          <Card
            key={meeting._id} // Use _id as the key
            sx={{
              width: "100%",
              maxWidth: 400,
              padding: 2,
              backgroundColor: "rgba(33, 33, 33, 0.85)",
              color: "#fff",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.5)",
              borderRadius: "20px",
              position: "relative",
              overflow: "visible",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "-25px",
                left: "50%",
                transform: "translateX(-50%)",
                width: 60,
                height: 60,
                backgroundColor: "#333",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 10px rgba(0,0,0,0.5)",
              }}
            >
              <Image src={upcoming} alt="Upcoming Icon" width={30} height={30} />
            </Box>

            <CardContent>
              <Typography variant="body1" sx={{ mb: 1.5, fontWeight: "bold" }}>
                {meeting.title} {/* Display meeting title */}
              </Typography>
              <Typography variant="body2" sx={{ color: "#aaa" }}>
                Last Updated: {new Date(meeting.updatedAt).toLocaleString()} {/* Display last updated time */}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                <Avatar alt={meeting.hostDetails.fullName} />
                <Box>
                  <Typography variant="body2">
                    Host: {meeting.hostDetails.fullName} {/* Display host's full name */}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#aaa" }}>
                    {meeting.hostDetails.email} {/* Display host's email */}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body1" sx={{ color: "#fff" }}>
          No meetings available {/* Display message when no meetings are found */}
        </Typography>
      )}
    </Box>
  );
}