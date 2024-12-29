import { useRoomContext } from '@/components/shared/room/room-context';
import ScheduleSelector from '@/components/shared/schedule-selector';
import useAuth from '@/hooks/auth';
import { useContractFormik } from '.';

export default function Schedules() {
  const { user } = useAuth();

  const { formik } = useContractFormik();

  const { scheduled } = useRoomContext();

  return (
    <div>
      <ScheduleSelector
        items={scheduled}
        onPick={(item) => {
          formik?.setFieldValue('schedule_id', item.id);
          formik?.setFieldValue('schedule', item);
        }}
        defaultSchedule={formik?.values?.['schedule']}
        defaultSelectedId={formik?.values?.['schedule_id']}
      />
    </div>
  );
}
