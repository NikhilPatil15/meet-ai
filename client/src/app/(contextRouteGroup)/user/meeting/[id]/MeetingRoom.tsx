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
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import EndCallButton from "@/components/ui/EndCallButton";
import axiosInstance from "@/utils/axios";

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
  const [participantCount, setParticipantCount] = useState(0);
  const client = useStreamVideoClient();
  const user = client?.streamClient.user?.name;

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
    const handleResize = () => {
      if (window.innerWidth >= 768 && layout === 'speaker-right') { 
        setLayout('speaker-right');
      } else if (window.innerWidth >= 768 && layout === 'speaker-left') {
        setLayout('speaker-left');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => {
      window.removeEventListener('resize', handleResize);
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
    return <div className="mx-auto ">Loading...</div>;
  }

  // Generate the meeting URL for QR code and invite link
  const meetingUrl = `https://yourapp.com/meeting/${call?.cid}`;

  const copyInviteLink = () => {
    navigator.clipboard.writeText(meetingUrl)
      .then(() => {
        alert("Invite link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

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
                <CallParticipantsList onClose={() => setShowParticipants(false)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call Controls and Buttons */}
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap bg-transparent px-4 py-2 z-30">
        <CallControls onLeave={() => router.push("/")} />
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
