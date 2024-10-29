"use client";
import React, { useState } from "react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { Button } from "@mui/material";

// AvatarCard Component (Placeholder)
// Uncomment this if you have your custom AvatarCard component
// import AvatarCard from "../User/Avatar/AvatarCard";

const MeetingSummary = () => {
  const [pdfFile, setPdfFile] = useState<string | null>(null);

  // Array of avatar URLs
  const avatar = [
    "https://www.w3schools.com/howto/img_avatar.png",
    "https://www.w3schools.com/howto/img_avatar.png",
    // Add more URLs if needed
  ];

  // Handles PDF Uploads
  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(URL.createObjectURL(file));
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  return (
    <div className="bg-gray-900 text-gray-300 w-full min-h-screen">
      <div className="container mx-auto p-6">
        {/* Hero Section */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white shadow-md">Meeting Summary</h1>
          <p className="text-lg mt-2">Date: October 8, 2024 | Duration: 1 hour</p>
        </header>

        {/* Meeting Overview Card */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold">Meeting Overview</h2>
          <p><strong>Host:</strong> John Doe</p>
          <p><strong>Participants:</strong></p>
          <div className="flex space-x-4 mt-4">
            {avatar.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Participant ${index + 1}`}
                className="w-10 h-10 rounded-full border-2 border-white"
              />
            ))}
          </div>
        </div>

        {/* PDF Preview Section */}
        <section className="bg-gray-800 rounded-lg p-6 shadow-lg mt-6">
          <h2 className="text-xl font-semibold mb-4">PDF Preview</h2>
          <div className="flex items-center">
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfUpload}
              className="bg-gray-700 text-white p-2 rounded-md"
            />
          </div>
          <div className="mt-4">
            {pdfFile ? (
              <div className="w-full h-96 bg-gray-600 rounded-md">
                <Worker workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js`}>
                  <Viewer fileUrl={pdfFile} />
                </Worker>
              </div>
            ) : (
              <p className="text-gray-400 mt-2">No PDF selected</p>
            )}
          </div>
        </section>

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
