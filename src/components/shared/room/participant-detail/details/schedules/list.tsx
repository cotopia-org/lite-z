import { useApi } from '@/hooks/swr';
import { useMemo } from 'react';
import { useUserDetail } from '..';
import { ScheduleType } from '@/types/calendar';
import FullLoading from '@/components/shared/full-loading';
import Schedules from '@/components/shared/schedules';
import { capitalizeWords } from '@/lib/utils';
import BoxHolder from '@/components/shared/box-holder';
import { useRoomContext } from '../../../room-context';
import { ScheduleFillment } from '@/components/shared/room/tools/top-left/schedule-button';

type Props = {
  justView?: boolean;
};

export default function SchedulesList({ justView = true }: Props) {
  const { workspaceUsers } = useRoomContext();
  const { user } = useUserDetail();

  const { data, isLoading } = useApi(`/users/${user?.id}/schedules`);
  const schedules: ScheduleType[] = data !== undefined ? data?.data : [];

  const totalHours = useMemo(() => {
    return workspaceUsers.find((x) => x.id === user?.id)?.schedule_hours_in_week
      ?.hours;
  }, [workspaceUsers, user]);

  if (data === undefined || isLoading) return <FullLoading />;

  return (
    <BoxHolder title={``}>
      <ScheduleFillment userId={user?.id} />

      <Schedules items={schedules} justView={justView} />
    </BoxHolder>
  );
}
