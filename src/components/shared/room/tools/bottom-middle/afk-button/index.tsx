import { useLoading } from '@/hooks';
import useSetting from '@/hooks/use-setting';
import { useAppDispatch } from '@/store';
import { disableAfk, enableAfk } from '@/store/slices/setting-slice';
import { thunkResHandler } from '@/utils/utils';
import { HeadphonesIcon } from 'lucide-react';
import { dispatch as busDispatch } from 'use-bus';
import { __BUS } from '@/const/bus';
import StreamButton from '../stream-button';
import { HeadphoneOffIcon } from '@/components/icons';
import { useMediaContext } from '../../../media-context';
import { useCallback } from 'react';
import { usePermissionContext } from '@/pages/workspace/permission-context';
import { useRoomContext } from '../../../room-context';
import useAuth from '@/hooks/auth';

export default function AfkButtonTool() {
  const { voiceOff } = useMediaContext();

  const { user: profile } = useAuth();

  const { resetStreamHandler } = usePermissionContext();

  const { room } = useRoomContext();
  const { reduxSettings } = useSetting();

  const is_afk = reduxSettings.afk;

  const participants = room?.participants || [];

  const { startLoading, stopLoading, isLoading } = useLoading();
  const dispatch = useAppDispatch();
  const handleToggleAfk = useCallback(() => {
    const userNode = participants.find((p) => p.id === profile.id);

    const userStoped = !userNode?.hasTimeCounted;
    startLoading();
    if (is_afk === true) {
      thunkResHandler(
        dispatch(disableAfk()),
        'users/beOnline',
        () => {
          stopLoading();
          resetStreamHandler();
          if (!userStoped) {
            busDispatch(__BUS.startWorkTimer);
          }
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
          voiceOff();
          if (!userStoped) {
            busDispatch(__BUS.stopWorkTimer);
          }
        },
        () => {
          stopLoading();
        },
      );
    }
  }, [
    dispatch,
    is_afk,
    resetStreamHandler,
    startLoading,
    stopLoading,
    participants,
    voiceOff,
  ]);

  return (
    <StreamButton
      tooltipTitle={`${!is_afk ? 'Enable AFK' : 'Disable AFK'}`}
      onClick={handleToggleAfk}
      loading={isLoading}
      isActive={!is_afk}
    >
      {({ color }) => {
        let icon = <HeadphonesIcon color={color} size={20} />;

        if (is_afk) {
          icon = <HeadphoneOffIcon color={color} size={20} />;
        }

        return icon;
      }}
    </StreamButton>
  );
}
