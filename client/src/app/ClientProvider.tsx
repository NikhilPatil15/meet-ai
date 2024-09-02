"use client";

import {
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { base_url } from "@/config/config";
import axios from "axios";
import useAuth from "@/hooks/useAuth";

interface ClientProviderProps {
  children: React.ReactElement;
}

export default function ClientProvider({ children }: ClientProviderProps) {
  const videoClient:any = useInitializeVideoClient();

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
}

function useInitializeVideoClient() {
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const { user, loading: authLoading } = useAuth();
  console.log(user);
  

  useEffect(() => {
    const initializeClient = async () => {
      if (authLoading || !user) {
        setLoading(false);
        return;
      }

      const streamUser: User = {
        id: user._id,
        name: user.userName,
      };

      const apiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;

      if (!apiKey) {
        throw new Error("Stream API key not set");
      }

      try {
        const response = await axios.get(
          `${base_url}/token/get-token-user?userId=${user._id}`
        );

        const client = new StreamVideoClient({
          apiKey,
          user: streamUser,
          tokenProvider: () => Promise.resolve(response.data.token),
        });

        setVideoClient(client);
      } catch (error) {
        console.error("Failed to initialize stream client: ", error);
      } finally {
        setLoading(false);
      }
    };

    initializeClient();

    return () => {
      if (videoClient) {
        videoClient.disconnectUser();
        setVideoClient(null);
      }
    };
  }, [user, authLoading]);

  return loading ? null : videoClient;
}
