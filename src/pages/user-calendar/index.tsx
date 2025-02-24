import FullLoading from '@/components/shared/full-loading';
import useAuth from '@/hooks/auth';
import axiosInstance from '@/services/axios';
import { useEffect, useState } from 'react';
import Calendar from '@/components/shared/calendar';
import { DateClickArg } from '@fullcalendar/interaction';
import AddAvailability from './components/clicked-date';
import { useLoading } from '@/hooks';
import { CalendarAvailabilityType } from '@/types/availibility';
import CDialog from '@/components/shared-ui/c-dialog';
import CotopiaButton from '@/components/shared-ui/c-button';

export default function UserCalendarPage() {
  const [clickedDate, setClickedDate] = useState<DateClickArg>();

  const { user } = useAuth();

  const { startLoading, stopLoading, isLoading } = useLoading();
  const [availabilities, setAvailibilities] = useState<
    CalendarAvailabilityType[]
  >([]);

  useEffect(() => {
    async function getAvailabilities() {
      startLoading();
      axiosInstance
        .get<CalendarAvailabilityType[]>(`/users/${user.id}/availabilities`)
        .then((res) => {
          stopLoading();
          setAvailibilities(res.data);
        })
        .catch((err) => {
          stopLoading();
        });
    }
    getAvailabilities();
  }, []);

  // const events = useMemo(() => {
  //   return [];
  // }, []);

  console.log('availabilities', availabilities);

  if (isLoading) return <FullLoading />;

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
      {!!clickedDate && (
        <AddAvailability
          onAdd={(availability) => {}}
          onClose={() => setClickedDate(undefined)}
        />
      )}
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold">My Schedule</h1>
        <CDialog
          trigger={(open) => (
            <CotopiaButton onClick={open}>Add Availability</CotopiaButton>
          )}
        >
          {(close) => <AddAvailability onClose={close} onAdd={close} />}
        </CDialog>
      </div>
      <Calendar events={events} onDateClick={setClickedDate} />
    </div>
  );
}
