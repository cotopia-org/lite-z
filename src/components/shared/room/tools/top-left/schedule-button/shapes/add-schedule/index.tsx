import CotopiaButton from '@/components/shared-ui/c-button';
import { FullModalBox } from '@/components/shared/modal-box';
import { Plus } from 'lucide-react';
import AddScheduleContent from './content';
import { ScheduleType } from '@/types/calendar';

type Props = {
  onDelete?: () => void;
  onCreated: (item: ScheduleType) => void;
  user_id?: number;
};

export default function AddScheduleButton({
  onDelete,
  onCreated,
  user_id,
}: Props) {
  return (
    <FullModalBox
      trigger={(open) => (
        <CotopiaButton startIcon={<Plus />} onClick={open}>
          Add Schedule
        </CotopiaButton>
      )}
      className="w-[640px]"
    >
      {(open, close) => (
        <AddScheduleContent
          onClose={close}
          onCreated={(item) => {
            if (onCreated) onCreated(item);
            close();
          }}
          user_id={user_id}
        />
      )}
    </FullModalBox>
  );
}
