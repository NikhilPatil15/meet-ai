"use client";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import {
  Call,
  CallControls,
  CancelCallButton,
  ParticipantView,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideoClient,
  ToggleAudioPublishingButton,
  ToggleVideoPreviewButton,
  ToggleVideoPublishingButton,
  useCallStateHooks,
  useParticipantViewContext,
} from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { base_url } from "@/config/config";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";

interface MeetingPageProps {
  id: string;
}

export default function MeetingPage({ id }: MeetingPageProps) {
  const router = useRouter();
  const [call, setCall] = useState<Call | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [client, setClient] = useState<StreamVideoClient | null>(null);

  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  useEffect(() => {
    const initializeGuestClient = async (
      guestUserId: string,
      username: string
    ) => {
      try {
        const response = await axios.get(
          `${base_url}/token/get-token-guest?guestId=${guestUserId}`
        );
        console.log(response);

        const apiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;
        if (!apiKey) {
          throw new Error("Stream API key not set");
        }

        const client = new StreamVideoClient({
          apiKey,
          user: { id: guestUserId, name: username },
          tokenProvider: () => Promise.resolve(response.data.token),
        });

        setClient(client);
      } catch (error) {
        console.error("Error initializing guest client:", error);
      }
    };

    if (!userInfo && username) {
      const guestUserId = `guest_${Date.now()}`;
      initializeGuestClient(guestUserId, username);
    } else if (userInfo) {
      const initializeClient = async () => {
        const apiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;
        if (!apiKey) {
          throw new Error("Stream API key not set");
        }

        const client = new StreamVideoClient({
          apiKey,
          user: {
            id: userInfo._id,
            name: userInfo.userName || userInfo._id,
          },
          tokenProvider: async () => {
            const response = await axios.get(
              `${base_url}/token/get-token-user?userId=${userInfo._id}`
            );
            return response.data.token;
          },
        });

        setClient(client);
      };

      initializeClient();
    }
  }, [userInfo, username]);
  // useEffect(()=>{
  //   if (call) {

  //     console.log("Microphone: ");
  //   }
  // },[call])

  const handleJoinMeeting = async () => {
    if (!client) return;

    setLoading(true);

    const call = client.call("default", id);
    await call.join();
    setCall(call);
    setLoading(false);
  };
  const handleLeaveMeeting = () => {
    call?.leave({ reject: true });
    router.push("/");
  };

  if (!call) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        {!userInfo && (
          <input
            type="text"
            placeholder="Enter your name"
            value={username ?? ""}
            onChange={(e) => setUsername(e.target.value)}
            className="input-class"
          />
        )}

        {loading ? (
          <Loader2 className="mx-auto animate-spin" />
        ) : (
          <button
            onClick={handleJoinMeeting}
            disabled={loading || (!userInfo && !username)}
          >
            Join meeting
          </button>
        )}
      </div>
    );
  }

  return (
    <StreamTheme className="space-y-3 p-4">
      <StreamCall call={call}>
        <SpeakerLayout />
        <CallControls onLeave={() => handleLeaveMeeting()} />
      </StreamCall>
    </StreamTheme>
  );
}
