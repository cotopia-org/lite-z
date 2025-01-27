import { MicIcon, MicOffIcon } from '@/components/icons';
import CotopiaTooltip from '@/components/shared-ui/c-tooltip';
import { useUserDetail } from '.';
import { useRoomContext } from '../../room-context';
import { useLoading } from '@/hooks';
import CotopiaIconButton from '@/components/shared-ui/c-icon-button';
import { colors } from '@/const/varz';
import axiosInstance from '@/services/axios';
import { toast } from 'sonner';
import useAuth from '@/hooks/auth';
import { isUserAdmin } from '@/lib/utils';

export default function UserHardMute() {
  const { user, closePopover } = useUserDetail();

  const { user: profile } = useAuth();

  const { room, workspace_id } = useRoomContext();

  const { isLoading, startLoading, stopLoading } = useLoading();

  const participants = room?.participants || [];

  const target_user = participants.find((p) => p.id === user?.id);

  const isAdmin = isUserAdmin(
    profile,
    workspace_id ? +workspace_id : undefined,
  );

  if (!isAdmin) return null;
  if (!target_user) return null;

  const hard_muted = target_user?.hard_muted;

  const toggleMicHandler = async () => {
    if (!target_user) return toast.error('User not found!');
    try {
      startLoading();
      await axiosInstance.get(`/users/${target_user.id}/toggleHardMute`);
      if (closePopover) closePopover();
      stopLoading();
    } catch (error) {
      stopLoading();
    }
  };

  return (
    <CotopiaTooltip title={`${hard_muted ? 'User Muted' : 'Mute User'}`}>
      <CotopiaIconButton
        onClick={toggleMicHandler}
        className="w-5 h-5"
        disabled={isLoading}
      >
        {hard_muted ? (
          <MicOffIcon color={colors.error.default} size={17} />
        ) : (
          <MicIcon size={17} />
        )}
      </CotopiaIconButton>
    </CotopiaTooltip>
  );
}
