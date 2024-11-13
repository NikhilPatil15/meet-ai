import axiosInstance from '@/utils/axios';
import { Button } from '@mui/material';
import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import React from 'react';

const EndCallButton = (meeting:any) => {
  const call:any = useCall();
  const router = useRouter();
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  // Check if the local participant is the owner of the call
  console.log("Meeting: ", meeting.meeting.hostDetails._id);
  console.log("Local Participant: ", localParticipant?.userId)
  const isMeetingOwner = localParticipant?.userId === meeting?.meeting?.hostDetails?._id

 /*TODO: the localParticipant id of the host and the call.state.createdby.id of should be same  */
 console.log("Meeting Owner: ",isMeetingOwner);
//  console.log("Call: ", call.state.createdBy);

  

  const handleEndCall = async () => {
    try {
      // End the call for everyone
      await call?.endCall();
      // Redirect to the homepage
      router.push('/');

        
    } catch (error) {
      console.error('Error ending the call:', error);
    }
  };

  if (!isMeetingOwner) return null;
  return (
    <Button
      onClick={handleEndCall}
      className='bg-red-500 text-white hover:bg-red-600'
    >
      End Call for Everyone
    </Button>
  );
};

export default EndCallButton;
