"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";
import chatClient from "@/lib/streamChatConfig";
import { Chat, Channel, MessageList, MessageInput } from "stream-chat-react";
import {
  CallControls,
  CallingState,
  CallParticipantsList,
  PaginatedGridLayout,
  SpeakerLayout,
  useCall,
  useCallStateHooks,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutGrid,
  LayoutList,
  BetweenHorizonalEnd,
  BetweenVerticalEnd,
  User,
  Loader2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/utils/axios";
import useAuth from "@/hooks/useAuth";
import EndCallButton from "@/components/ui/EndCallButton";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

const MeetingRoom = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");
  const { useCallCallingState, useMicrophoneState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const { isMute } = useMicrophoneState();

  const call = useCall();
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [chatId, setChatId] = useState<any>();
  const [token, setToken] = useState<string | null>(null);
  const [channel, setChannel] = useState<any>(null);
  const client = useStreamVideoClient();
  const { user: userInfo } = useAuth();
  const [transcript, setTranscript] = useState("");

  const sendSpeech = async (text: string) => {
    try {
      const textToSend = `${userInfo?.name}: ${text}`;
      const res = await axiosInstance.patch("/summary/add-dialogue", {
        dialogue: textToSend,
        meetingId: call?.cid,
      });
    } catch (error) {
      console.error("Error sending speech:", error);
    }
  };

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const speechRecognition = new window.webkitSpeechRecognition();
      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;
      speechRecognition.lang = "en-IN";

      speechRecognition.onresult = (event) => {
        const updatedTranscript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setTranscript(updatedTranscript);
        console.log("Updated Transcript:", updatedTranscript);
        sendSpeech(updatedTranscript);
      };

      speechRecognition.onerror = (event) => {
        console.error("Speech recognition error detected:", event.error);
      };

      setRecognition(speechRecognition);
    } else {
      alert("Browser does not support speech recognition. Please use Chrome.");
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && layout === "speaker-right") {
        setLayout("speaker-right");
      } else if (window.innerWidth >= 768 && layout === "speaker-left") {
        setLayout("speaker-left");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [layout]);

  useEffect(() => {
    if (recognition) {
      if (!isMute) {
        recognition.start();
        console.log("Started listening...");
      } else {
        recognition.stop();
        console.log("Stopped listening...");
      }
    }
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isMute, recognition]);

  const addNewUserToChannel = async (newUserId: any) => {
    try {
      //TODO:
      if (!chatId?.chatChannelId) return;
      const chatChannel = chatClient.channel(
        "messaging",
        chatId?.chatChannelId
      );
      await chatChannel.addMembers([newUserId]);
      console.log("User added to channel:", chatChannel);
      setChannel(chatChannel);
    } catch (error) {
      console.error("Error adding user to chat channel:", error);
    }
  };

  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-left":
        return <SpeakerLayout participantsBarPosition="left" />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition="right" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  if (callingState !== CallingState.JOINED) {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  // Generate the meeting URL for QR code and invite link
  const meetingUrl = "https://yourapp.com/meeting/${call?.cid}";

  const copyInviteLink = () => {
    navigator.clipboard
      .writeText(meetingUrl)
      .then(() => {
        alert("Invite link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const fetchMeeting = async () => {
    try {
      const res = await axiosInstance.get(`/meeting/get-meeting/${call?.cid}`);
      // console.log(res.data.data);
      setChatId(res.data.data);
    } catch (error) {
      console.error("Error fetching meeting:", error);
    }
  };

  useEffect(() => {
    fetchMeeting();
  }, [call?.cid]);

  const getToken = async () => {
    try {
      const userId = userInfo?._id;
      const res = await axiosInstance.post(`/token/get-token-chat`, { userId });
      setToken(res.data.token);
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  const handleAddJoinedParticipant = async (user: any) => {
    try {
      console.log(user);
      const res = await axiosInstance.put(`/meeting/add-participant`, {
        user,
        roomId: call?.cid,
      });
      console.log(res.data);

      if (res.data.success) {
        await addNewUserToChannel(user.userId); //TODO:
      }
    } catch (error) {
      console.error("Error adding participant:", error);
    }
  };

  useEffect(() => {
    const initChat = async () => {
      await handleAddJoinedParticipant(userInfo);
      await getToken();
      if (token && userInfo) {
        try {
          await chatClient.connectUser(
            { id: userInfo._id, name: userInfo.userName },
            token
          );

          console.log(chatId?.chatMembers);

          const uniqueMembers = [
            userInfo._id,
            ...(chatId?.chatMembers || []),
          ].filter((member, index, self) => self.indexOf(member) === index);

          console.log(uniqueMembers);

          const chatChannel = chatClient.channel(
            "messaging",
            chatId?.chatChannelId,
            {
              members: uniqueMembers,
            }
          );

          await chatChannel.watch();
          setChannel(chatChannel);
        } catch (error) {
          console.error("Error initializing chat:", error);
        }
      }
    };
    initChat();
  }, [token, chatId]);

  useEffect(() => {
    if (channel) {
      channel.on("member.added", (event: any) => {
        console.log("New member added:", event.user.id);
      });
    }
  }, [channel]);

  const handleLeaveMeeting = async () => {
    try {
      const response = await axiosInstance.put(
        `/meeting/end-meeting/${call?.cid}`
      );
      alert(response.data.message);
      router.push("/");
    } catch (error) {
      console.error("Error ending meeting:", error);
    }
  };

  if (callingState !== CallingState.JOINED) {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  return (
    <section className="relative h-screen w-full overflow-hidden text-white">
      <div className="rd__layout relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px]">
          <CallLayout />
        </div>

        {/* Participants Sidebar */}
        <div
          className={cn(
            "rd__sidebar",
            showParticipants ? "rd__sidebar--open" : ""
          )}
        >
          <div className="rd__sidebar__container">
            <div className="rd__participants">
              <div className="str-video__participant-list">
                {/* Participant List */}
                <CallParticipantsList
                  onClose={() => setShowParticipants(false)}
                />
              </div>
              <div className="str-video__participant-list">
                {!channel && <p>Loading...</p>}
                {channel && (
                  <Chat client={chatClient} theme="messaging dark">
                    <Channel channel={channel}>
                      <MessageList />
                      <MessageInput />
                    </Channel>
                  </Chat>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call Controls and Buttons */}
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap bg-transparent px-4 py-2 z-30">
        <CallControls onLeave={handleLeaveMeeting} />
        <div className="hidden md:block">
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
              {[
                { label: "Grid", icon: <LayoutGrid size={16} /> },
                {
                  label: "Speaker-Left",
                  icon: <BetweenHorizonalEnd size={16} />,
                },
                {
                  label: "Speaker-Right",
                  icon: <BetweenVerticalEnd size={16} />,
                },
              ].map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  className="cursor-pointer flex items-center gap-2"
                  onClick={() =>
                    setLayout(
                      item.label
                        .toLowerCase()
                        .replace(" ", "-") as CallLayoutType
                    )
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <User size={20} className="text-white" />
          </div>
        </button>
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  );
};

export default MeetingRoom;
