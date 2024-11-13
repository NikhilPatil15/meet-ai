import axiosInstance from "@/utils/axios";
import { Button } from "@mui/material";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import React from "react";

const EndCallButton = ({ text }: string | any) => {
  const call: any = useCall();
  const router = useRouter();

  // Check if the local participant is the owner of the call

  /*TODO: the localParticipant id of the host and the call.state.createdby.id of should be same  */
  console.log("Meeting Owner: ");
  //  console.log("Call: ", call.state.createdBy);

  const handleEndCall = async () => {
    try {
      // End the call for everyone

      await call?.endCall();

      const response = await axiosInstance.put(
        `/meeting/end-meeting/${call?.cid}`
      );
      router.replace("/");
    } catch (error) {
      console.error("Error ending the call:", error);
    }
  };

  return (
    <Button
      onClick={handleEndCall}
      className="bg-red-500 text-white hover:bg-red-600"
    >
      {text}
    </Button>
  );
};

export default EndCallButton;
