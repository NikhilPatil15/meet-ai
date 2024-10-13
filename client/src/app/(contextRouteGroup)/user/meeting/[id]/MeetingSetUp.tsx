// In `MeetingSetUp.tsx` or `MeetingSetUp.jsx`
import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { DeviceSettings, useCall, useCallStateHooks, VideoPreview } from '@stream-io/video-react-sdk';
import AudioVolumeIndicator from '@/components/Meeting/AudioVolumeIndicator'; // Ensure path is correct
import PermissionPrompt from '@/components/Meeting/PermissionPrompt';

interface SetupUIProps {
  onSetUpComplete: () => void;
}

const MeetingSetUp = ({ onSetUpComplete }: SetupUIProps) => {
  const call = useCall();
  const { useMicrophoneState, useCameraState } = useCallStateHooks();
  const [micCamDisabled, setMicCamDisabled] = useState(false);

  useEffect(() => {
    const manageDevices = async () => {
      if (call) {
        try {
          if (micCamDisabled) {
            // Disable camera and microphone
            await call.camera.disable();
            await call.microphone.disable();
          } else {
            // Enable camera and microphone
            await call.camera.enable();
            await call.microphone.enable();
          }
        } catch (error) {
          console.error("Error managing devices: ", error);
        }
      }
    };

    manageDevices();
  }, [micCamDisabled, call]);

  const micState = useMicrophoneState();
  const camState = useCameraState();

  // Check if microphone or camera permissions are missing
  if (!micState.hasBrowserPermission || !camState.hasBrowserPermission) {
    return <PermissionPrompt />;
  }

  return (
    <div className='flex flex-col items-center gap-3'>
      <h1 className='text-center text-2xl font-bold'>SetUp</h1>
      <VideoPreview />
      <div className='flex h-16 items-center gap-3'>
        <AudioVolumeIndicator />
        <DeviceSettings />
      </div>

      {/* Checkbox to disable/enable microphone and camera */}
      <label className='flex items-center gap-2 font-medium'>
        <input
          type="checkbox"
          checked={micCamDisabled}
          onChange={(e) => setMicCamDisabled(e.target.checked)}
        />
        Join with mic and camera off
      </label>
      <Button onClick={onSetUpComplete}>Join Meeting</Button>
    </div>
  );
};

export default MeetingSetUp;
