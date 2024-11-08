import { asyncHandler } from "../utils/asyncHandler";
import Meeting, { IMeeting } from "../models/meeting.model";
import { Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import mongoose, { ObjectId } from "mongoose";
import { IUser, User } from "../models/user.model";
import { ApiResponse } from "../utils/apiResponse";
import { streamClient } from "../config/getStream";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { serverClient } from "../config/chatConfig";

const { ObjectId } = mongoose.Types;
const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60;
const issuedAt = Math.floor(Date.now() / 1000) - 60;

const createMeeting: any = asyncHandler(async (req: any, res: Response) => {
  const {
    title,
    description,
    participants,
    scheduledTime,
    type,
    status,
    roomId,
  } = req?.body;
  const createdBy = req?.user?.id;

  let participantsList: any[] = [
    {
      userId: createdBy,
      role: "host",
      userName: req?.user?.userName,
      avatar: req?.user?.avatar,
    },
  ];

  if (type === "private" && participants?.length > 0) {
    const otherParticipants = await Promise.all(
      participants.map(async (participant: any) => {
        if (participant._id === createdBy) {
          return null;
        }
        if (participant.userName) {
          const user: any = await User.findOne({
            userName: participant.userName,
          });
          if (user) {
            return {
              userId: user.id.toString(),
              role: "participant",
              userName: user.userName,
            };
          } else {
            throw new ApiError(
              404,
              `User with user name ${participant.userName} not found`
            );
          }
        } else if (participant.guestName) {
          const guestId = crypto.randomUUID();
          return {
            guestId,
            role: "guest",
            guestName: participant.guestName,
          };
        } else {
          throw new ApiError(400, "Invalid participant details");
        }
      })
    );
    participantsList = participantsList.concat(
      otherParticipants.filter(Boolean)
    );
  }

  const newMeeting = await Meeting.create({
    title,
    host: createdBy,
    description,
    participants: participantsList,
    scheduledTime:
      scheduledTime && status === "scheduled"
        ? scheduledTime
        : new Date().toISOString(),
    createdBy: new ObjectId(createdBy),
    roomId: roomId,
    status: status ? status : "not scheduled",
    type: type,
    chatMembers: participantsList
      .filter((p: any) => p && p.userId)
      .map((p: any) => p.userId),
  });

  if (!newMeeting) {
    throw new ApiError(500, "Something went wrong");
  }
  let createdChannel;

  try {
    await serverClient.upsertUser({
      id: "system_bot",
      name: "System Bot",
    });

    const channel = serverClient.channel("messaging", {
      name: `Chat for Meeting: ${newMeeting.title}`,
      members: [...newMeeting?.chatMembers, "system_bot"],
      created_by: { id: createdBy },
    });

    // console.log(channel);

    createdChannel = await channel.create();

    newMeeting.chatChannelId = createdChannel.channel.cid;
    newMeeting.save();
  } catch (error) {
    console.error("Error creating chat channel:", error);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(201, { newMeeting, createdChannel }, "Meeting created")
    );
});

const addJoinedParticipant: any = asyncHandler(
  async (req: any, res: Response) => {
    console.log(req?.user);
    const user = {
      userId: req?.body.user?._id,
      userName: req?.body.user?.userName,
      avatar: req?.body.user?.avatar,
      role: "user",
    };

    console.log(user);

    const meeting: IMeeting | any = await Meeting.findOne({
      roomId: req?.body?.roomId,
    });

    if (!meeting) {
      throw new ApiError(404, "Meeting not found");
    }

    if (meeting?.status === "completed") {
      throw new ApiError(410, "Meeting was ended");
    }

    if (meeting?.status === "canceled") {
      throw new ApiError(410, "Meeting was canceled");
    }

    if (meeting?.host?.toString() === req?.user?.id) {
      throw new ApiError(401, "You are the host");
    }

    const isParticipantExists = meeting?.participants?.some(
      (p: any) => p.userId && p.userId.toString() === req?.user?.id
    );

    if (isParticipantExists) {
      return res.status(400).json({
        success: false,
        message: "Participant already exists in the meeting",
      });
    }
    meeting.participants.push(user);
    await meeting.save();

    try {
      const channel = serverClient.channel("messaging", meeting.chatChannelId);
      console.log(channel);

      const createdChannel = await channel.addMembers([user.userId]);
      console.log("createdChannel", createdChannel);
    } catch (error) {
      console.error("Error adding participant to chat channel:", error);
    }

    return res
      .status(200)
      .json(new ApiResponse(201, meeting, "Participant added successfully"));
  }
);

const endMeeting: any = asyncHandler(async (req: any, res: Response) => {
  const { meetingId } = req.params;
  const meeting = await Meeting.findById(meetingId);

  if (!meeting) {
    throw new ApiError(404, "Meeting not found");
  }

  if (meeting.status === "completed" || meeting.status === "canceled") {
    throw new ApiError(400, "Meeting already ended or canceled");
  }

  const currentTime = new Date();
  meeting.endTime = currentTime;

  const duration =
    (currentTime.getTime() - meeting.scheduledTime.getTime()) / 6000;
  meeting.duration = duration;

  meeting.status = "completed";

  await meeting.save();

  return res
    .status(200)
    .json(new ApiResponse(201, meeting, "Meeting ended successfully"));
});

const getMeeting: any = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  const meeting = await Meeting.aggregate([
    { $match: { roomId: id } },
    {
      $lookup: {
        from: "users",
        localField: "host",
        foreignField: "_id",
        as: "hostDetails",
      },
    },
    {
      $unwind: "$hostDetails",
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        participants: 1,
        scheduledTime: 1,
        createdBy: 1,
        status: 1,
        host: 1,
        roomId: 1,
        createdAt: 1,
        updatedAt: 1,
        enableSummary: 1,
        fileUrl: 1,
        fileName: 1,
        dialogues: 1,
        chatChannelId: 1,
        chatMembers: 1,
        "hostDetails._id": 1,
        "hostDetails.userName": 1,
        "hostDetails.email": 1,
      },
    },
  ]);

  if (!meeting) {
    throw new ApiError(404, "Meeting not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(201, meeting[0], "Meeting found successfully"));
});

export { createMeeting, addJoinedParticipant, endMeeting, getMeeting };
