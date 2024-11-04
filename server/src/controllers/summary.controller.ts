import { Response } from "express";
import Meeting, { IMeeting } from "../models/meeting.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/apiError";
// import { promises as fs } from "fs";
import fs from "fs";
import { writeFile } from "fs/promises";
import { Document, Packer, Paragraph, TextRun } from "docx";
import path from "path";
import uploadOnCloudinary from "../utils/cloudinary";

const addDialogue = asyncHandler(async (req: any, res: Response) => {
  const { dialogue, meetingId } = req.body;
  if (!dialogue || !meetingId) {
    throw new ApiError(400, "Dialogue or meeting id is missing!");
  }
  // if (!isValidObjectId(meetingId)) {
  //   throw new ApiError(400, "Invalid meeting id!");
  // }

  const meeting: any = await Meeting.findOne({ roomId: meetingId });
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

<<<<<<< HEAD
  // if(req.summary){
  //   console.log("Summary in the generate summary file function: ", req?.summary);
  //   return res.json(new ApiResponse(200,"Summary fetched successfully!"))
  // }

=======
>>>>>>> bd67bda5c7573aa0a023d7b3e7505aa5dbdcb611
  const { roomId } = req.params;
  const meeting: IMeeting | any = await Meeting.findOne({ roomId: roomId });

  if (!meeting) {
    throw new ApiError(404, "Meeting not found");
  }

  if (meeting?.enableSummary) {
    const dirPath = path.join(__dirname, "../../public/temp");
    const filePath = path.join(
      dirPath,
      `${meeting?.title} ${new Date().getTime()}.docx`
    );
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
    fs.writeFileSync(filePath, buffer);

    try {
      const cloudinaryResult = await uploadOnCloudinary(filePath);
      meeting.fileUrl = cloudinaryResult?.url;
      meeting.fileName = cloudinaryResult?.public_id;
      await meeting?.save();

      return res
        .status(200)
        .json(
          new ApiResponse(
            201,
            meeting,
            "File created and uploaded successfully"
          )
        );
    } catch (error) {
      throw new ApiError(500, "File upload failed");
    }
  } else {
    throw new ApiError(404, "Summarize meeting not enabled");
  }
});

const enableSummary = asyncHandler(async (req: any, res: Response) => {
  const { roomId } = req.params;
  const meeting: IMeeting | any = await Meeting.findOne({ roomId: roomId });
  if (!meeting) {
    throw new ApiError(404, "Meeting not found");
  }
  meeting.enableSummary = true;
  meeting.save();
  return res
    .status(200)
    .json(new ApiResponse(201, "Summary enabled successfully"));
});

export { addDialogue, generateSummaryFile, enableSummary };
