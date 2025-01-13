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

const EmptyPrompt = ({ trigger, room, onDelete }: Props) => {
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
            title="Are you sure?"
            description={
              <div className="flex w-full items-center gap-x-1">
                <span className="text-grayscale-subtitle font-medium">
                  {'Are you sure you want to delete the room'}
                </span>
                <span className="font-bold">{`"${room.title}"`}</span>
                <span className="text-grayscale-subtitle font-medium">?</span>
              </div>
            }
            submitText="Delete Room"
            loading={isLoading}
            onClose={close}
            onSubmit={handleDelete}
          />
        );
      }}
    </CDialog>
  );
};

export default EmptyPrompt;
