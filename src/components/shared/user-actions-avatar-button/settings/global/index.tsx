import TitleSwitch from '@/components/shared/title-switch';
import useSetting from '@/hooks/use-setting';
import { useAppDispatch } from '@/store';
import { toggleSoundSettingAction } from '@/store/slices/setting-slice';

export default function GlobalSettings() {
  const setting = useSetting();
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col gap-y-4">
      <TitleSwitch
        title="User join/left has sound"
        checked={setting.sounds.userJoinLeft}
        onCheckedChange={() =>
          dispatch(toggleSoundSettingAction({ key: 'userJoinLeft' }))
        }
      />
      <TitleSwitch
        title="Message incoming has sound"
        checked={setting.sounds.messageIncoming}
        onCheckedChange={() =>
          dispatch(toggleSoundSettingAction({ key: 'messageIncoming' }))
        }
      />
    </div>
  );
}
