import mongoose ,{Schema,Document, ObjectId} from "mongoose";

export interface IMeeting extends Document{
    _id : ObjectId ;
    title : string ;
    description ?: string ;
    startTime : Date ;
    endTime : Date ;
    participants:ObjectId[];
    meetingLink : string ;
    createdBy : ObjectId;
}

