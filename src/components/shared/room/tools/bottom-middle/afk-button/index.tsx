import CotopiaIconButton from '@/components/shared-ui/c-icon-button'
import CotopiaTooltip from '@/components/shared-ui/c-tooltip'
import { useLoading } from '@/hooks'
import useSetting from '@/hooks/use-setting'
import { cn } from '@/lib/utils'
import { useAppDispatch } from '@/store'
import { disableAfk, enableAfk } from '@/store/slices/setting-slice'
import { thunkResHandler } from '@/utils/utils'
import { useLocalParticipant } from '@livekit/components-react'
import { Track } from 'livekit-client'
import { PauseCircle, PlayCircle } from 'lucide-react'
import { useRoomHolder } from '../../..'
import {dispatch as busDispatch} from 'use-bus'
import { __BUS } from '@/const/bus'

export default function AfkButtonTool() {

    const participant = useLocalParticipant()
    
      const localParticipant = participant.localParticipant
      let voiceTrack = undefined
      if (
        localParticipant &&
        typeof localParticipant?.getTrackPublication !== "undefined"
      ) {
        //@ts-nocheck
        voiceTrack = localParticipant?.getTrackPublication(Track.Source.Microphone)
      }
    
      const track = voiceTrack?.track

    const {afk} = useSetting()

      const {
        enableAudioAccess,
        disableAudioAccess,
      } = useRoomHolder()

    const {startLoading, stopLoading, isLoading} = useLoading()
    const dispatch = useAppDispatch();
    const handleToggleAfk = () => {

        startLoading();
        if ( afk === true) {
            thunkResHandler(dispatch(disableAfk()), 'users/beOnline', () => {
                stopLoading();
                track?.unmute();
                enableAudioAccess();
                busDispatch(__BUS.startWorkTimer)
            }, () => {
                stopLoading();
            })
            
        } else {
            thunkResHandler(dispatch(enableAfk()), 'users/beAfk', () => {
                stopLoading();
                track?.mute();
                disableAudioAccess();
                busDispatch(__BUS.stopWorkTimer)
            }, ()=> {
                stopLoading();
            })
            
        }
    }

  return (
    <CotopiaTooltip title={afk === false ? `Enable AFK` : `Disable AFK`}>
        <CotopiaIconButton className={cn('text-black !rounded-lg', afk === true ? '!bg-yellow-100' : '')} onClick={handleToggleAfk} loading={isLoading}>
            {afk === true ? <PlayCircle /> : <PauseCircle />}
        </CotopiaIconButton>
    </CotopiaTooltip>
  )
}
