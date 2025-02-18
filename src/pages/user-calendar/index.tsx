import FullLoading from '@/components/shared/full-loading';
import useAuth from '@/hooks/auth';
import { useApi } from '@/hooks/swr';
import { FetchDataType } from '@/services/axios';
import { useMemo } from 'react';
import Calendar from '@/components/shared/calendar';

export default function UserCalendarPage() {
  const { user } = useAuth();
  const { data, isLoading } = useApi<FetchDataType<any>>(
    `/users/${user.id}/availabilities`,
  );
  const availabilities = data !== undefined ? data?.data : [];

  // const events = useMemo(() => {
  //   return [];
  // }, []);

  if (data === undefined || isLoading) return <FullLoading />;

  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  const events = [
    {
      title: 'Morning Standup',
      start: `${today}T09:00:00`,
      end: `${today}T09:30:00`,
      extendedProps: {
        id: 'sample-id',
      },
    },
    {
      title: 'Project Meeting',
      start: `${today}T11:00:00`,
      end: `${today}T12:00:00`,
    },
    {
      title: 'Lunch Break',
      start: `${today}T13:00:00`,
      end: `${today}T14:00:00`,
    },
    {
      title: 'Client Call',
      start: `${today}T15:30:00`,
      end: `${today}T16:00:00`,
    },
    {
      title: 'Code Review',
      start: `${today}T17:00:00`,
      end: `${today}T18:00:00`,
    },
  ];

  return (
    <div className="p-4 flex flex-col gap-y-4">
      <h1 className="text-3xl font-bold">My Schedule</h1>
      <Calendar events={events} />
    </div>
  );
}
