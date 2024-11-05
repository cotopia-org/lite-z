import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import {
  TrackMutedIndicatorProps,
  useTrackMutedIndicator,
} from "@livekit/components-react";
import { Mic, MicOff } from "lucide-react";

type Props = {
  trackRef: TrackMutedIndicatorProps["trackRef"];
  forceMuted?: boolean;
};

export default function MicButton({ trackRef, forceMuted = false }: Props) {
  const { isMuted } = useTrackMutedIndicator(trackRef);

  return (
    <CotopiaIconButton className='w-8 h-8 text-black/60'>
      {isMuted || forceMuted ? <MicOff size={22} /> : <Mic size={22} />}
    </CotopiaIconButton>
  );
}
