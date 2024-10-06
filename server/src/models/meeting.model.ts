import mongoose ,{Schema,Document, ObjectId, model} from "mongoose";

export interface IMeeting extends Document{
    _id : ObjectId ;
    title : string ;
    participants:Schema.Types.ObjectId[];
    description ?: string ;
    scheduledTime : Date ;
    duration: number;
    createdBy : Schema.Types.ObjectId;
    status: 'scheduled'|'not scheduled' | 'completed' | 'canceled';
    endTime ?: Date ;
    host: Schema.Types.ObjectId;
    roomId: string; // Unique room ID
}


const MeetingSchema = new Schema<IMeeting>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    scheduledTime: {
        type: Date,
        default: Date.now()
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ['scheduled', 'not scheduled', 'completed', 'canceled'],
        default: "scheduled",
    },
    host: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    roomId: {
        type: String,
        required: true,
        unique: true
    }
},{timestamps: true})

const Meeting = model<IMeeting>("Meeting", MeetingSchema);

export default Meeting