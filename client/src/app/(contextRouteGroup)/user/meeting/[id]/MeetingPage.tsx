"use client";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "@/styles/globals.css";
import {
  Call,
  StreamCall,
  StreamTheme,
  StreamVideoClient,
  StreamVideo,
} from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import MeetingScreen from "./MeetingScreen";
import axiosInstance from "@/utils/axios";

interface MeetingPageProps {
  id: string;
}

export default function MeetingPage({ id }: MeetingPageProps) {
  const router = useRouter();
  const [call, setCall] = useState<Call | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [meeting, setMeeting] = useState<any>();

  const { user } = useSelector((state: RootState) => state?.auth);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const res = await axiosInstance.get(`/meeting/get-meeting/default:${id}`);
        console.log(res.data.data);
        setMeeting(res.data.data.roomId)
      } catch (error) {
        console.log(error);
      }
    };
    fetchMeeting();
  }, [id]);

  useEffect(() => {
    const initializeClient = async (
      guestUserId?: string,
      username?: string
    ) => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;
        if (!apiKey) throw new Error("Stream API key not set");

        const tokenRequestConfig = user
          ? { method: "get", url: `/token/get-token-user?userId=${user._id}` }
          : {
              method: "post",
              url: "/token/get-token-guest",
              data: { guestId: guestUserId, guestName: username },
            };

        const response = await axiosInstance(tokenRequestConfig);

        console.log(response.data);
        

        const streamClient = new StreamVideoClient({
          apiKey,
          user: {
            id: guestUserId || user?._id,
            name: username || user?.userName || user?._id,
          },
          tokenProvider: () => Promise.resolve(response.data.token),
        });

        setClient(streamClient);
      } catch (error) {
        console.error("Error initializing client:", error);
      }
    };

    if (user) {
      initializeClient();
    } else if (username) {
      const guestUserId = `guest_${Date.now()}`;
      initializeClient(guestUserId, username);
    }
  }, [user, username]);

  const handleJoinMeeting = async () => {
    if (!client) return;

    setLoading(true);
    try {
      const call = client.call("default", id);
      await call.join();
      setCall(call);
      const participantData = {
        roomId: id,
        userId: user ? user._id : Date.now(),
        userName: user ? user.userName : username,
        avatar: user ? user.avatar : "",
      };

      const res = await axiosInstance.put("/meeting/add-participant", {
        user: participantData,
        roomId: meeting
      });
      console.log("Participant added:", res.data.data);
    } catch (error) {
      console.error("Error joining meeting:", error);
    } finally {
      setLoading(false);
    } 
  };



  if (!client || !call) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        {!user && (
          <input
            type="text"
            placeholder="Enter your name"
            value={username ?? ""}
            onChange={(e) => setUsername(e.target.value)}
            className="input-class"
          />
        )}
        <button
          onClick={handleJoinMeeting}
          disabled={loading || (!user && !username)}
        >
          {loading ? (
            <Loader2 className="mx-auto animate-spin" />
          ) : (
            "Join meeting"
          )}
        </button>
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamTheme className="space-y-3">
        <StreamCall call={call}>
          <MeetingScreen />
        </StreamCall>
      </StreamTheme>
    </StreamVideo>
  );
}