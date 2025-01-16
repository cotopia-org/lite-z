import CotopiaTooltip from '@/components/shared-ui/c-tooltip';
import { useParticipantTileCtx } from './participant-tile-provider';
import { Ghost, TimerOff } from 'lucide-react';

export default function GhostLayer() {
  const { userFullName } = useParticipantTileCtx();

  return (
    <CotopiaTooltip title={userFullName}>
      <div className="afk absolute top-0 left-0 w-full h-full bg-black/50 text-white z-[100] flex items-center justify-center font-bold">
        <Ghost />
      </div>
    </CotopiaTooltip>
  );
}
