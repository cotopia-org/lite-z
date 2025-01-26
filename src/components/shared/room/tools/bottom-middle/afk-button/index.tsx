import { useLoading } from '@/hooks';
import useSetting from '@/hooks/use-setting';
import { useAppDispatch } from '@/store';
import { disableAfk, enableAfk } from '@/store/slices/setting-slice';
import { thunkResHandler } from '@/utils/utils';
import { useLocalParticipant } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { HeadphonesIcon } from 'lucide-react';
import { useRoomHolder } from '../../..';
import { dispatch as busDispatch } from 'use-bus';
import { __BUS } from '@/const/bus';
import StreamButton from '../stream-button';
import { HeadphoneOffIcon } from '@/components/icons';

export default function AfkButtonTool() {
  const participant = useLocalParticipant();

  const localParticipant = participant.localParticipant;
  let voiceTrack = undefined;
  if (
    localParticipant &&
    typeof localParticipant?.getTrackPublication !== 'undefined'
  ) {
    //@ts-nocheck
    voiceTrack = localParticipant?.getTrackPublication(Track.Source.Microphone);
  }

  const track = voiceTrack?.track;

  const { afk } = useSetting();

  const { disableAudioAccess, disableAfkHandler } = useRoomHolder();

  const { startLoading, stopLoading, isLoading } = useLoading();
  const dispatch = useAppDispatch();
  const handleToggleAfk = () => {
    startLoading();
    if (afk === true) {
      thunkResHandler(
        dispatch(disableAfk()),
        'users/beOnline',
        () => {
          stopLoading();
          disableAfkHandler();
          busDispatch(__BUS.startWorkTimer);
        },
        () => {
          stopLoading();
        },
      );
    } else {
      thunkResHandler(
        dispatch(enableAfk()),
        'users/beAfk',
        () => {
          stopLoading();
          track?.mute();
          disableAudioAccess();
          busDispatch(__BUS.stopWorkTimer);
        },
        () => {
          stopLoading();
        },
      );
    }
  };

  return (
    <StreamButton
      tooltipTitle={`${!afk ? 'Enable AFK' : 'Disable AFK'}`}
      onClick={handleToggleAfk}
      loading={isLoading}
      isActive={!afk}
    >
      {({ color }) => {
        let icon = <HeadphonesIcon color={color} size={20} />;

        if (afk) {
          icon = <HeadphoneOffIcon color={color} size={20} />;
        }

        return icon;
      }}
    </StreamButton>
  );
}
