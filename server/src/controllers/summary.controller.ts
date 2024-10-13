import { Response } from "express"
import Meeting, { IMeeting } from "../models/meeting.model"
import { asyncHandler } from "../utils/asyncHandler"
import { ApiResponse } from "../utils/apiResponse"

const addDialogue = asyncHandler(async (req: any, res: Response) => {
    const { dialogue, meetingId } = req.body;
    if (!dialogue || !meetingId) {
      return res.status(400).json(new ApiResponse(400, null, "Dialogue or Meeting ID missing"));
    }
    const meeting: any = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json(new ApiResponse(404, null, "Meeting not found"));
    }
    if (!meeting.dialogues || meeting.dialogues === "") {
      meeting.dialogues = dialogue;
    } else {
      meeting.dialogues += `\n${dialogue}`;
    }
    await meeting.save();
  
    return res.status(200).json(new ApiResponse(200, meeting, "Dialogue appended successfully"));
  });

export {
    addDialogue
}