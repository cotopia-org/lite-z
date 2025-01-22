import { MegaphoneIcon, MegaphoneOffIcon } from 'lucide-react';
import { useRoomContext } from '../../../room-context';
import useAuth from '@/hooks/auth';
import { useLoading } from '@/hooks';
import axiosInstance from '@/services/axios';
import { isUserAdmin } from '@/lib/utils';
import { toast } from 'sonner';
import StreamButton from '../stream-button';
import useSetting from '@/hooks/use-setting';
import { dispatch } from 'use-bus';
import { __BUS } from '@/const/bus';

export default function MegaPhoneButtonTool() {
  const { room, workspace_id } = useRoomContext();

  const { startLoading, stopLoading, isLoading } = useLoading();

  const { user } = useAuth();
  const { afk } = useSetting();

  const is_admin = isUserAdmin(user, workspace_id) ?? false;

  const mgEnabled = room?.is_megaphone;

  const toggleMegaphoneHandler = async () => {
    if (afk) return toast.error('You should first enable your AFK');
    if (!room) return;
    if (!is_admin)
      return toast.error('You dont have permission to do this action');
    startLoading();
    try {
      await axiosInstance.get(`/rooms/${room.id}/toggleMegaphone`);
      dispatch(__BUS.refreshNodeAudio);
      stopLoading();
    } catch (error) {
      stopLoading();
    }
  };

  return (
    <StreamButton
      tooltipTitle={`${mgEnabled ? 'Disable Megaphone' : 'Enable Megaphone'}`}
      onClick={toggleMegaphoneHandler}
      disabled={isLoading}
      isActive={!!mgEnabled}
    >
      {({ color }) => {
        let icon = <MegaphoneOffIcon color={color} size={20} />;
        if (mgEnabled) {
          icon = <MegaphoneIcon color={color} size={20} />;
        }
        return icon;
      }}
    </StreamButton>
  );
}
