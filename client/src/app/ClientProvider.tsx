"use client";

import {
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { base_url } from "@/config/config";
import { useRouter } from "next/navigation";
import axios from "axios";

interface ClientProviderProps {
  children: React.ReactElement;
}

export default function ClientProvider({ children }: ClientProviderProps) {
  const videoClient: any = useInitializeVideoClient();

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
}

function useInitializeVideoClient() {
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  useEffect(() => {
    const initializeClient = async () => {
      if (!userInfo) {
        setLoading(false);
        return;
      }

      const streamUser: User = {
        id: userInfo._id,
        name: userInfo.userName,
      };

      const apiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;

      if (!apiKey) {
        throw new Error("Stream API key not set");
      }

      try {
        const response = await axios.get(
          `${base_url}/token/get-token-user?userId=${userInfo._id}`
        );

        const client = new StreamVideoClient({
          apiKey,
          user: streamUser,
          tokenProvider: () => Promise.resolve(response.data.token),
        });

        setVideoClient(client);
      } catch (error) {
        console.log("Failed to initialize stream client: ", error);
      } finally {
        setLoading(false);
      }
      setLoading(false);
    };
    initializeClient();

    return () => {
      if (videoClient) {
        videoClient.disconnectUser();
        setVideoClient(null);
      }
    };
  }, [userInfo]);

  return loading ? null : videoClient;
}
