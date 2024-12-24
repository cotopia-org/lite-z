import CotopiaTooltip from '@/components/shared-ui/c-tooltip'
import { useParticipantTileCtx } from './participant-tile-provider'
import {  TimerOff } from 'lucide-react'

export default function AfkLayer() {

  const { userFullName } =
    useParticipantTileCtx()

  return (
   <CotopiaTooltip title={userFullName}>
      <div className='absolute top-0 left-0 w-full h-full bg-yellow-400/50 text-black z-[100] rounded-full flex items-center justify-center font-bold'>
        <TimerOff />
      </div>
   </CotopiaTooltip>
  )
}
