import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
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
  const { user } = useAuth();

  const liveKitIdentity = identity;
  const myScreenShare = liveKitIdentity === user?.username;

  const handleStopShareScreen = () => dispatch(__BUS.stopMyScreenSharing);

  useKeyPress("Escape", () => onExitFullScreen());

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
