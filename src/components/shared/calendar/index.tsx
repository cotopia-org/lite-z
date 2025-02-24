import FullCalendar from '@fullcalendar/react';
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  InfoIcon,
} from 'lucide-react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useEffect, useRef, useState } from 'react';
import CotopiaIconButton from '@/components/shared-ui/c-icon-button';
import { EventSourceInput } from '@fullcalendar/core';
import EventTooltip from './tooltip/shapes/event';

type Props = {
  events: EventSourceInput;
  onDateClick?: (arg: DateClickArg) => void;
};

export default function Calendar({ events = [], onDateClick }: Props) {
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleEventClick = (info: any) => {
    console.log('info', info);

    const metadata = info?.event.extendedProps;

    const rect = info.el.getBoundingClientRect(); // Get the position of the event element
    setModalPosition({
      top: rect.top + window.scrollY + rect.height + 10, // Position below the event
      left: rect.left + window.scrollX, // Align horizontally with the event
    });

    setSelectedEvent({
      title: info.event.title,
      description:
        info.event.extendedProps.description || 'No details available.',
      start: info.event.start.toLocaleString(),
      metadata,
    });
  };
  useEffect(() => {
    //@ts-ignore
    const handleClickOutside = (event) => {
      if (selectedEvent === null) return;

      if (event?.target?.classList?.contains('fc-event-title')) return;
      if (event?.target?.classList?.contains('fc-event-title-container'))
        return;
      if (event?.target?.classList?.contains('fc-event')) return;
      if (event?.target?.classList?.contains('fc-event-main')) return;
      if (event?.target?.classList?.contains('fc-event-time')) return;

      if (
        modalRef.current !== null &&
        modalRef.current.contains(event.target) === false
      ) {
        setSelectedEvent(null);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [selectedEvent]);

  const [dateRangeText, setDateRangeText] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date().toDateString());

  const calendarRef = useRef<FullCalendar>(null);

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

  return (
    <div className="flex flex-col border border-grayscale-border rounded-xl">
      <div className="header border-b flex p-4 justify-between">
        <span className="text-grayscale-subtitle text-base font-medium flex flex-row gap-x-2 items-center">
          <InfoIcon size={16} />
          Click Time Slots to see the details.
        </span>
        <div className="flex flex-row items-center gap-x-2">
          <CotopiaIconButton className="text-black/80" onClick={handlePrev}>
            <ChevronLeft />
          </CotopiaIconButton>
          <div className="rounded-lg border border-grayscale-border p-2 flex flex-row items-center gap-x-2 font-medium text-sm">
            <CalendarIcon size={16} />
            {dateRangeText}
          </div>
          <CotopiaIconButton className="text-black/80" onClick={handleNext}>
            <ChevronRight />
          </CotopiaIconButton>
        </div>
      </div>
      <FullCalendar
        events={events}
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        eventClick={handleEventClick}
        dateClick={onDateClick}
        allDaySlot={false}
        initialView="timeGridWeek"
        ref={calendarRef}
        headerToolbar={false}
        dayHeaderFormat={{ weekday: 'short', day: 'numeric' }}
        datesSet={(info) => {
          const options = { month: 'long', day: 'numeric', year: 'numeric' };
          //@ts-ignore
          const formattedRange = `${new Date(info.start).toLocaleDateString('en-US', options)} - ${new Date(info.end).toLocaleDateString('en-US', options)}`;
          setDateRangeText(formattedRange);
        }}
      />
      {selectedEvent && (
        <div
          ref={modalRef}
          style={{
            position: 'absolute',
            top: `${modalPosition.top}px`,
            left: `${modalPosition.left}px`,
            zIndex: 1000,
          }}
        >
          <EventTooltip
            onClose={() => setSelectedEvent(null)}
            title="Time slot details"
            event={selectedEvent}
          />
        </div>
      )}
    </div>
  );
}
