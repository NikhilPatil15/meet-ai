"use client";
import { Box, Button, IconButton } from "@mui/material";
import AvatarCard from "../User/Avatar/AvatarCard";
import DocumentPreview from "./FilePreview";
import axiosInstance from "@/utils/axios";
import { useEffect, useState } from "react";
import moment from "moment";
import { CircleArrowLeftIcon, StepBackIcon } from "lucide-react";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

const MeetingSummary = ({ id }: any) => {
  const [meeting, setMeeting] = useState<any>(null);
  const [participants, setParticipants] = useState<any>([]);
  const router = useRouter()

  const fetchDetails = async () => {
    try {
      const response = await axiosInstance.get(`/meeting/get-meeting/${id}`);
      const meetingData = response.data.data;
      console.log(meetingData);
      setMeeting(meetingData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBack = ()=>{
    router.push("/user/dashboard/history")
  }

  useEffect(() => {
    fetchDetails();
  }, [id]);

  useEffect(() => {
    if (meeting) {
      const participantAvatars = meeting.participants
        ?.filter((participant: any) => participant.role === "participant")
        .map((participant: any) => ({
          name: participant.userName,
          avatar:
            participant.avatar ||
            "https://www.w3schools.com/howto/img_avatar.png",
        }));
      setParticipants(participantAvatars);
    }
  }, [meeting]);

  return (
    <div className="bg-gray-900 text-gray-300 w-full min-h-screen">
      <div>
        <IconButton onClick={handleBack} sx={{ color: "white" }}>
          <CircleArrowLeftIcon height={"3rem"} width={"3rem"} />
        </IconButton>
      </div>
      <div className="container mx-auto p-6">
        {/* Hero Section */}
        <header className=" mb-8">
          <h1 className="text-center text-4xl font-bold text-white shadow-md">
            Meeting Summary
          </h1>
        </header>
        <Box
          sx={{
            marginTop: "1.5rem",
            bgcolor: "#1f2937",
            borderRadius: "1rem",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <h2 className="text-xl font-semibold">Meeting Details</h2>
          <div>
            <p className="text-lg">
              <strong>Title:</strong> {meeting?.title}
            </p>
            <p className="text-lg">
              <strong>Description: </strong>
              {meeting?.description}
            </p>
            <p className="text-lg">
              <strong>Date: </strong>
              {moment(meeting?.scheduledAt).format("MMMM Do YYYY")} | Duration:
              1 hour
            </p>
          </div>
        </Box>

        {/* Meeting Overview Card */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold">Meeting Overview</h2>
          <p>
            <strong>Host:</strong> John Doe
          </p>
          <p>
            <strong>Participants:</strong>
          </p>

          <AvatarCard avatar={participants} />
        </div>

        <DocumentPreview
          fileUrl="https://res.cloudinary.com/dk9jbxeiw/raw/upload/v1730136588/sad37mjfsnjatpcilwjr.docx"
          fileName="this is file"
        />

        {/* Call to Action */}
        <div className="text-center mt-8">
          <Button variant="contained" color="success">
            Schedule Next Meeting
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MeetingSummary;
