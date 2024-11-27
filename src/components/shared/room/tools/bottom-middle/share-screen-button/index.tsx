import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import { ScreenShare, X } from "lucide-react";
import {
  useParticipantTracks,
  useRoomContext,
  useTracks,
} from "@livekit/components-react";
import { useCallback, useEffect, useState } from "react";
import useBus from "use-bus";

import CotopiaTooltip from "@/components/shared-ui/c-tooltip";
import { __BUS } from "@/const/bus";
import { Track } from "livekit-client";

export default function ShareScreenButtonTool() {
  const room = useRoomContext();

  const track = useTracks([Track.Source.ScreenShare]);

  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const stopScreenShare = useCallback(async () => {
    try {
      await room.localParticipant.setScreenShareEnabled(false);
      setIsScreenSharing(false); // Update state when screen sharing stops
    } catch (err) {
      console.error("Error stopping screen share:", err);
    }
  }, []);

  const startScreenShare = useCallback(async () => {
    try {
      await room.localParticipant.setScreenShareEnabled(true);
      // await room.localParticipant.unpublishTrack();
      setIsScreenSharing(true); // Update state when screen sharing stops
    } catch (err) {
      console.error("Error starting screen share:", err);
    }
  }, []);

  // useBus(__BUS.stopMyScreenSharing, () => {
  //   stopScreenShare();
  // });

  return (
    <CotopiaTooltip
      title={isScreenSharing ? `Stop screen sharing` : `Share screen`}
    >
      <CotopiaIconButton
        className='text-black'
        onClick={() =>
          isScreenSharing ? stopScreenShare() : startScreenShare()
        }
      >
        {isScreenSharing ? <X size={20} /> : <ScreenShare size={20} />}
      </CotopiaIconButton>
    </CotopiaTooltip>
  );
}
