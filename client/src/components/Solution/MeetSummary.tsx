"use client";
import { Button } from "@mui/material";
import AvatarCard from "../User/Avatar/AvatarCard";
import DocumentPreview from "./FilePreview";

const MeetingSummary = () => {

  const avatar = [
    "https://www.w3schools.com/howto/img_avatar.png",
    "https://www.w3schools.com/howto/img_avatar.png",
    "https://www.w3schools.com/howto/img_avatar.png",
    "https://www.w3schools.com/howto/img_avatar.png",
    "https://www.w3schools.com/howto/img_avatar.png",
    "https://www.w3schools.com/howto/img_avatar.png",
    "https://www.w3schools.com/howto/img_avatar.png",
    "https://www.w3schools.com/howto/img_avatar.png",
  ];

  return (
    <div className="bg-gray-900 text-gray-300 w-full min-h-screen">
      <div className="container mx-auto p-6">
        {/* Hero Section */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white shadow-md">
            Meeting Summary
          </h1>
          <p className="text-lg mt-2">
            Date: October 8, 2024 | Duration: 1 hour
          </p>
        </header>

        {/* Meeting Overview Card */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold">Meeting Overview</h2>
          <p>
            <strong>Host:</strong> John Doe
          </p>
          <p>
            <strong>Participants:</strong>
          </p>

          <AvatarCard avatar={avatar} />
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
