import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import { useRoomContext } from "@/components/shared/room/room-context";
import { doCirclesMeet } from "@/components/shared/room/sessions/room-audio-renderer";
import { __BUS } from "@/const/bus";
import useAuth from "@/hooks/auth";
import useKeyPress from "@/hooks/use-key-press";
import { Maximize2, Minimize2, X } from "lucide-react";
import { dispatch } from "use-bus";

type Props = {
  identity: string;
  isFullScreen?: boolean;
  onFullScreen: () => void;
  onExitFullScreen: () => void;
};

export default function Actions({
  identity,
  isFullScreen,
  onFullScreen,
  onExitFullScreen,
}: Props) {
  const { room } = useRoomContext();
  const { user } = useAuth();

  const liveKitIdentity = identity;
  const myScreenShare = liveKitIdentity === user?.username;

  const targetUser = room?.participants?.find(
    (a) => a.username === liveKitIdentity
  );

  const myTargetUser = room?.participants?.find(
    (a) => a.username === user?.username
  );

  const { meet } = doCirclesMeet(myTargetUser, targetUser);

  const handleStopShareScreen = () => dispatch(__BUS.stopMyScreenSharing);

  useKeyPress("Escape", () => onExitFullScreen());

  if (!meet) return null;

  return (
    <div className='actions absolute z-10 top-4 left-4 flex flex-row items-center gap-x-2 opacity-0 invisible transition-all'>
      <CotopiaIconButton className='text-black/60 z-10' onClick={onFullScreen}>
        {isFullScreen ? <Minimize2 /> : <Maximize2 />}
      </CotopiaIconButton>
      {!!myScreenShare && (
        <CotopiaIconButton
          className='text-black/60 z-10'
          onClick={handleStopShareScreen}
        >
          <X />
        </CotopiaIconButton>
      )}
    </div>
  );
}
