import {
  SpeakerLayout,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
// import UpcomingMeetingScreen from './UpcomingMeetingScreen';
// import MeetingEndedScreen from '@/app/(contextRouteGroup)/user/meeting/[id]/MeetingEndedScreen';
import MeetingSetUp from "./MeetingSetUp";
import MeetingRoom from "./MeetingRoom";


const MeetingScreen = () => {
  const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();
  const [setUpComplete, setSetUpComplete] = useState(false);
  const callEndAt = useCallEndedAt();
  const callStartAt = useCallStartsAt();
  const callIsInFuture = callStartAt && new Date(callStartAt) > new Date();
  const callHasEnded = !!callEndAt;

  if (callHasEnded) {
    // return <MeetingEndedScreen />;
  }

  if (callIsInFuture) {
    // return <UpcomingMeetingScreen />;
  }

  return (
    <div className="space-y-6">
      {setUpComplete ? (
        <MeetingRoom></MeetingRoom>
      ) : (
<<<<<<< HEAD
        <MeetingSetUp onSetUpComplete={() => setSetUpComplete(true)} />
=======
        <MeetingSetUp id={id} onSetUpComplete={() => setSetUpComplete(true)} />
>>>>>>> 54a9bc1c650174c88eaa2983a121cd4c010bdac0
      )}
    </div>
  );
};

export default MeetingScreen;
