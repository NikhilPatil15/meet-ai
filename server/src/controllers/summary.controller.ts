import { Response } from "express";
import Meeting, { IMeeting } from "../models/meeting.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/apiError";
// import { promises as fs } from "fs";
import fs from "fs"
import { writeFile } from "fs/promises";
import { Document, Packer, Paragraph, TextRun } from "docx";
import path from "path";
import uploadOnCloudinary from "../utils/cloudinary";

const addDialogue = asyncHandler(async (req: any, res: Response) => {
  const { dialogue, meetingId } = req.body;
  if (!dialogue || !meetingId) {
    throw new ApiError(400, "Dialogue or meeting id is missing!");
  }
  if (!isValidObjectId(meetingId)) {
    throw new ApiError(400, "Invalid meeting id!");
  }

  const meeting: any = await Meeting.findById(meetingId);
  if (!meeting) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Meeting not found"));
  }
  if (!meeting.dialogues || meeting.dialogues === "") {
    meeting.dialogues = dialogue;
  } else {
    meeting.dialogues += `\n${dialogue}`;
  }
  await meeting.save();

  return res
    .status(200)
    .json(new ApiResponse(200, meeting, "Dialogue appended successfully"));
});

const generateSummaryFile = asyncHandler(async (req: any, res: Response) => {
  console.log(req?.summary);

  const dirPath = path.join(__dirname, "../../public/temp");
  const filePath = path.join(dirPath, `${new Date().getTime()}.docx`);
  // const content = "This is the content of the file.";

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          //Title
          new Paragraph({
            children: [
              new TextRun({
                text: "Title",
                bold: true,
                size: 28,
              }),
            ],
          }),

          new Paragraph({ text: "This is title" }),

          // description:
          new Paragraph({
            children: [
              new TextRun({
                text: "Description: ",
                bold: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({ text: "this is description" }),

          //summary:
          new Paragraph({
            children: [
              new TextRun({
                text: "Summary: ",
                bold: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Something",
                size: 22,
              }),
            ],
            indent: { left: 720 }, // 720 twips = 0.5 inch indentation
          }),
        ],
      },
    ],
  });

  // await fs.mkdir(dirPath, { recursive: true });

  // await fs.writeFile(filePath, content, "utf-8");

  const buffer = await Packer.toBuffer(doc);
  const file = fs.writeFileSync(filePath, buffer);
  console.log(file);
  
  try {
    const cloudinaryResult = await uploadOnCloudinary(filePath);
    console.log(cloudinaryResult?.format);
    res.status(200).json({ message: "File created and uploaded successfully", cloudinaryResult });
  } catch (error) {
    res.status(500).json({ message: "File upload failed", error });
  }
});

export { addDialogue, generateSummaryFile };
