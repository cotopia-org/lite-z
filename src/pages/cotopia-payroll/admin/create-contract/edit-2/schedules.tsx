import { useRoomContext } from '@/components/shared/room/room-context';
import ScheduleSelector from '@/components/shared/schedule-selector';
import useAuth from '@/hooks/auth';
import { useContractFormik } from '.';
import CotopiaSwitch from '@/components/shared-ui/c-switch';
import AddScheduleButton from '@/components/shared/room/tools/top-left/schedule-button/shapes/add-schedule';
import Schedules from '@/components/shared/schedules';
import { isUserAdmin } from '@/lib/utils';

export default function ContractSchedules() {
  const { user } = useAuth();

  const { workspace_id } = useRoomContext();
  const { formik } = useContractFormik();

  const { scheduled } = useRoomContext();

  const values = formik?.values;

  const isAdmin = isUserAdmin(user, workspace_id);

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12">
        <CotopiaSwitch
          disabled={!isAdmin}
          label="In Schedule"
          checked={values?.in_schedule === 1}
          onCheckedChange={(value) => {
            formik?.setFieldValue('in_schedule', value === true ? 1 : 0);
          }}
          className="flex-col-reverse gap-y-4 [&_label]:font-bold [&_label]:text-base items-start"
        />
      </div>
      {values?.in_schedule ? (
        !!values?.schedule ? (
          <div className="col-span-12">
            <Schedules
              justView={
                values?.status === 'signed' || values?.status === 'active'
              }
              items={[values?.schedule]}
              onDelete={() => {
                formik?.setFieldValue('schedule', undefined);
              }}
              onUpdate={(item) => {
                formik?.setFieldValue('schedule', item);
              }}
            />
          </div>
        ) : (
          <div className="col-span-12">
            <AddScheduleButton
              onCreated={(item) => {
                formik?.setFieldValue('schedule', item);
                formik?.setFieldValue('schedule_id', item.id);
              }}
              user_id={values?.user_id ?? undefined}
            />
          </div>
        )
      ) : null}
    </div>
  );
}
