import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useMemo, useRef, useState } from 'react';
import { useApi } from '@/hooks/swr';
import { useParams } from 'react-router-dom';
import { ScheduleType } from '@/types/calendar';
import { FetchDataType } from '@/services/axios';
import FullLoading from '@/components/shared/full-loading';
import moment from 'moment';
import CotopiaButton from '@/components/shared-ui/c-button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getRandomColor } from '@/lib/utils';

export default function CalendarPage() {
  const { workspace_id } = useParams();

  const calendarRef = useRef<FullCalendar>(null);

  const { data, isLoading } = useApi<FetchDataType<ScheduleType[]>>(
    `/workspaces/${workspace_id}/schedules`,
  );
  const schedules = data !== undefined ? data?.data : [];

  const [currentDate, setCurrentDate] = useState(new Date().toDateString());

  const handlePrev = () => {
    if (calendarRef.current === null) return;

    let calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
    setCurrentDate(calendarApi.getDate().toDateString());
  };

  const handleNext = () => {
    if (calendarRef.current === null) return;

    let calendarApi = calendarRef.current.getApi();
    calendarApi.next();
    setCurrentDate(calendarApi.getDate().toDateString());
  };

  //   const handleToday = () => {
  //     if (calendarRef.current === null) return;

  //     let calendarApi = calendarRef.current.getApi();
  //     calendarApi.today();
  //     setCurrentDate(calendarApi.getDate().toDateString());
  //   };

  const events = useMemo(() => {
    const transformedEvents: any[] = [];

    schedules.forEach((entry) => {
      const userName = entry.user.name;
      const recurrenceStart = moment.tz(
        entry.recurrence_start_at,
        entry.timezone,
      );

      entry.days.forEach(({ day, times }) => {
        for (let weekOffset = 0; weekOffset < 4; weekOffset++) {
          const eventDate = recurrenceStart
            .clone()
            .startOf('week')
            .add(day, 'days')
            .add(weekOffset, 'weeks');

          times.forEach(({ start, end }) => {
            const startTime = eventDate
              .clone()
              //@ts-ignore
              .set({ hour: start.split(':')[0], minute: start.split(':')[1] })
              .format();
            const endTime = eventDate
              .clone()
              //@ts-ignore
              .set({ hour: end.split(':')[0], minute: end.split(':')[1] })
              .format();

            transformedEvents.push({
              id: `${entry.id}-${weekOffset}-${day}`,
              title: `${userName}`,
              start: startTime,
              end: endTime,
              backgroundColor: getRandomColor(entry.user.created_at),
              textColor: '#fff',
            });
          });
        }
      });
    });

    return transformedEvents;
  }, [schedules]);

  if (data === undefined || isLoading) return <FullLoading />;

  return (
    <div className="p-4">
      <div className="py-4 relative flex flex-row items-center justify-between">
        <CotopiaButton startIcon={<ArrowLeft />} onClick={handlePrev}>
          Prev
        </CotopiaButton>
        <CotopiaButton endIcon={<ArrowRight />} onClick={handleNext}>
          Next
        </CotopiaButton>
        <strong className="absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%]">
          {currentDate}
        </strong>
      </div>
      <FullCalendar
        events={events}
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        dateClick={(arg) => alert(arg.dateStr)}
        initialView="timeGridWeek"
        ref={calendarRef}
        headerToolbar={false}
      />
    </div>
  );
}
