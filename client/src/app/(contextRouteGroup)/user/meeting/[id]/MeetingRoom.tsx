"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import {
  CallControls,
  CallingState,
  CallParticipantsList,
  PaginatedGridLayout,
  SpeakerLayout,
  useCall,
  useCallStateHooks,
  StreamVideoClient,
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
import EndCallButton from "@/components/ui/EndCallButton";
import axiosInstance from "@/utils/axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

const MeetingRoom = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");
  const { useCallCallingState, useMicrophoneState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const { isMute } = useMicrophoneState();

  const call = useCall();
  console.log(call?.cid);

  const [transcript, setTranscript] = useState("");
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  // const { guest, user } = useSelector((state: RootState) => state.auth);
  const client = useStreamVideoClient();
  const user = client?.streamClient.user?.name

  const sendSpeech = async (text: string) => {
    try {
      const textToSend = `${user}: ${text}`;
      const res = await axiosInstance.patch("/summary/add-dialogue", {
        dialogue: textToSend,
        meetingId: call?.cid,
      });
      console.log("Speech sent:", res.data);
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
    return <Loader2 className="mx-auto animate-spin"/>;
  }

  return (
    <section className="relative h-screen w-full overflow-hidden text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px]">
          <CallLayout />
        </div>

        <div
          className={cn(
            "h-[calc(100vh-86px)] ml-2 p-5 transition-all duration-300",
            showParticipants ? "block" : "hidden"
          )}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap">
        <CallControls onLeave={() => router.push("/")} />

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
                    item.label.toLowerCase().replace(" ", "-") as CallLayoutType
                  )
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

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
