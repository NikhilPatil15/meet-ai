
"use client"
import React, { useState } from "react";
import AvatarCard from "../User/Avatar/AvatarCard";
import { Button } from "@mui/material";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { pdfjs } from "react-pdf";

// Set the worker path using a CDN
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js`;

const MeetingSummary = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const avatar = [
    "https://www.w3schools.com/howto/img_avatar.png",
    // Add more avatar URLs as needed
  ];

  const handlePdfUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(URL.createObjectURL(file));
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  return (
    <div className="bg-gray-900 text-gray-300">
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
          <AvatarCard avatar={avatar} />
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
                <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js">
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
          <button className="px-6 py-3 bg-green-500 rounded-md hover:bg-green-600">
            Schedule Next Meeting
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingSummary;
