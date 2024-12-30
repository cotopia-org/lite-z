import CotopiaButton from '@/components/shared-ui/c-button';
import CDialog from '@/components/shared-ui/c-dialog';
import { UserContractType } from '@/types/contract';
import InsertButtonForm from './form';
import { ArrowRight } from 'lucide-react';
import AddScheduleButton from '../../../../top-left/schedule-button/shapes/add-schedule';
import { ScheduleType } from '@/types/calendar';
import axiosInstance from '@/services/axios';

type Props = {
  contract: UserContractType;
  onUpdate?: (contract: UserContractType) => void;
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
        <AddScheduleButton
          onCreated={(item: ScheduleType) => {
            axiosInstance
              .put(`/contracts/${contract.id}`, { schedule_id: item.id })
              .then((res) => {
                if (onUpdate) onUpdate(res.data?.data);
              })
              .catch((err) => {});
          }}
        />
      )}
    </CDialog>
  );
}
