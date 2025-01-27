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
import { useWorkspaceContext } from '@/pages/workspace/workspace-context';

export default function AfkButtonTool() {
  const { voiceOff } = useMediaContext();

  const { resetStreamHandler } = useWorkspaceContext();

  const { reduxSettings } = useSetting();

  const is_afk = reduxSettings.afk;

  const { startLoading, stopLoading, isLoading } = useLoading();
  const dispatch = useAppDispatch();
  const handleToggleAfk = () => {
    startLoading();
    if (is_afk === true) {
      thunkResHandler(
        dispatch(disableAfk()),
        'users/beOnline',
        () => {
          stopLoading();
          resetStreamHandler();
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
          voiceOff();
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
