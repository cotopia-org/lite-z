import { useApi } from '@/hooks/swr';
import { useUserDetail } from '..';
import { ScheduleType } from '@/types/calendar';
import FullLoading from '@/components/shared/full-loading';
import Schedules from '@/components/shared/schedules';
import BoxHolder from '@/components/shared/box-holder';
import { ScheduleFillment } from '@/components/shared/room/tools/top-left/schedule-button';

type Props = {
  justView?: boolean;
};

export default function SchedulesList({ justView = true }: Props) {
  const { user } = useUserDetail();

  const { data, isLoading } = useApi(`/users/${user?.id}/schedules`);
  const schedules: ScheduleType[] = data !== undefined ? data?.data : [];

  if (data === undefined || isLoading) return <FullLoading />;

  return (
    <BoxHolder title={``}>
      <ScheduleFillment userId={user?.id} />
      <Schedules items={schedules} justView={justView} />
    </BoxHolder>
  );
}
