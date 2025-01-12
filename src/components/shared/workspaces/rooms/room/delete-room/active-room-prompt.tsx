import CDialog from '@/components/shared-ui/c-dialog';
import DeletePrompt from '@/components/shared-ui/c-prompt/content/delete-prompt';
import { useLoading } from '@/hooks';
import axiosInstance from '@/services/axios';
import { WorkspaceRoomShortType } from '@/types/room';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type Props = {
  trigger: (open: () => void) => ReactNode;
  room: WorkspaceRoomShortType;
  onDelete?: () => void;
};

const ActiveRoomPrompt = ({ trigger, room, onDelete }: Props) => {
  const { startLoading, stopLoading, isLoading } = useLoading();

  const navigate = useNavigate();

  const handleDelete = (onClose?: () => void) => {
    startLoading();
    axiosInstance
      .delete(`/rooms/${room.id}`)
      .then((res) => {
        toast.success(`"${room.title}" room has been deleted successfully`);
        navigate(`/dashboard`);
        stopLoading();
        if (onClose) onClose();
        if (onDelete) onDelete();
      })
      .catch((err) => {
        stopLoading();
      });
  };

  return (
    <CDialog hasClose trigger={trigger}>
      {(close) => {
        return (
          <DeletePrompt
            title="People are active here!"
            description={
              <span className="text-grayscale-subtitle font-medium">
                There are users active in{' '}
                <span className="!text-black font-bold">{`"${room.title}"`}</span>{' '}
                ,if you delete this room they will be disconnected. are you sure
                about this?
              </span>
            }
            cancelVariant={'primary'}
            submitVariant={'error-outline'}
            submitText="Delete Anyway!"
            loading={isLoading}
            onClose={close}
            onSubmit={handleDelete}
          />
        );
      }}
    </CDialog>
  );
};

export default ActiveRoomPrompt;
