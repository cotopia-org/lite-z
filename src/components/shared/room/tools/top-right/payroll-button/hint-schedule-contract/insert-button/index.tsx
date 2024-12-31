import CotopiaButton from '@/components/shared-ui/c-button';
import CDialog from '@/components/shared-ui/c-dialog';
import { UserContractType } from '@/types/contract';
import InsertButtonForm from './form';
import { ArrowRight, Plus } from 'lucide-react';
import AddScheduleButton from '../../../../top-left/schedule-button/shapes/add-schedule';
import { ScheduleType } from '@/types/calendar';
import axiosInstance from '@/services/axios';
import { FullModalBox } from '@/components/shared/modal-box';
import AddScheduleContent from '@/components/shared/room/tools/top-left/schedule-button/shapes/add-schedule/content';

type Props = {
  contract: UserContractType;
  onUpdate?: (schedule: ScheduleType) => void;
};
export default function InsertButton({ contract, onUpdate }: Props) {
  return (
    <CDialog
      trigger={(open) => (
        <CotopiaButton variant={'link'} endIcon={<ArrowRight />} onClick={open}>
          Insert schedule
        </CotopiaButton>
      )}
    >
      {(close) => (
        <AddScheduleContent
          onCreated={(item) => {
            if (onUpdate) onUpdate(item);
            //TODO: Should add schedule to contract
          }}
          onClose={close}
          contract_id={contract.id}
        />
      )}
    </CDialog>
  );
}
