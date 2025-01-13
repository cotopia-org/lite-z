import CotopiaIconButton from '@/components/shared-ui/c-icon-button';
import CotopiaTooltip from '@/components/shared-ui/c-tooltip';
import { Calendar } from 'lucide-react';
import { useUserDetail } from '..';
import { capitalizeWords } from '@/lib/utils';
import ModalBox from '@/components/shared/modal-box';
import SchedulesList from './list';

export default function UserSchedules() {
  const { user } = useUserDetail();

  let userLabel = user?.name;

  if (!!!userLabel) userLabel = user?.username;

  if (userLabel) userLabel = capitalizeWords(userLabel);

  const boxLabel = `${userLabel}'s schedules`;

  return (
    <ModalBox
      hasClose={false}
      trigger={(open) => (
        <CotopiaTooltip title={boxLabel}>
          <CotopiaIconButton
            onClick={open}
            size={'icon'}
            className="text-black w-6 h-6"
          >
            <Calendar size={16} />
          </CotopiaIconButton>
        </CotopiaTooltip>
      )}
      className="w-auto min-w-[600px]"
    >
      {(open, close) => {
        return <SchedulesList justView />;
      }}
    </ModalBox>
  );
}
