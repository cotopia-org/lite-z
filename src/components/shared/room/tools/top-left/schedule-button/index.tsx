import PopupBox from '@/components/shared/popup-box';
import PopupBoxChild from '@/components/shared/popup-box/child';
import { ScheduleType } from '@/types/calendar';
import {
  estimateTotalHoursBySchedules,
  formatTime,
  getTwelveClockFormat,
} from '@/lib/utils';
import moment from 'moment';
import ToolButton from '../../tool-button';
import { CalendarIcon } from '@/components/icons';
import { useApi } from '@/hooks/swr';
import Schedules from '@/components/shared/schedules';
import FullLoading from '@/components/shared/full-loading';
import AddScheduleButton from './shapes/add-schedule';
import { FetchDataType } from '@/services/axios';

export type FulFillmentType = {
  percentage: number;
  total_until_now_schedule: number;
  total_schedule: number;
  done: number;
  missing: number;
  remaining: number;
  total_days: number;
  mustWorkPerDay: number;
  totalDaysUntilNow: number;
  minimumWork: number;
};
export default function ScheduleButton() {
  const { data, isLoading, mutate } =
    useApi<FetchDataType<ScheduleType[]>>(`/users/me/schedules`);

  const schedules = data !== undefined ? data?.data : [];

  const totalHours = estimateTotalHoursBySchedules(schedules);

  const today = moment();

  const todayDay = today.day();

  let event_label = 'Add Schedule';
  const allDays = schedules.flatMap((day) => day.days);
  const todayDate = allDays.find((day) => +day.day === todayDay);
  if (todayDate) {
    let start_time = getTwelveClockFormat(todayDate.times[0].start);
    let end_time = getTwelveClockFormat(todayDate.times[0].end);
    let format_day = today.format('ddd');
    event_label = `${format_day} : ${start_time} - ${end_time}`;
  }

  if (schedules.length > 0 && !todayDate) event_label = 'Schedules';

  let title_node = (
    <div className="flex items-center gap-x-1">
      <span className="text-lg text-grayscale-title font-medium">
        Scheduled this week :
      </span>
      <span className="text-sm text-grayscale-subtitle font-medium">
        {totalHours > 0 ? `${totalHours}h ` : 'No schedule '}
      </span>
    </div>
  );

  return (
    <PopupBox
      trigger={(open, isOpen) => (
        <ToolButton
          open={open}
          onClick={open}
          startIcon={<CalendarIcon size={20} />}
          isOpen={isOpen}
        >
          {event_label}
        </ToolButton>
      )}
    >
      {(triggerPosition, open, close) => {
        let content = null;
        if (schedules.length > 0)
          content = (
            <Schedules justView={true} items={schedules} onDelete={mutate} />
          );
        if (isLoading || data === undefined) return <FullLoading />;
        return (
          <PopupBoxChild
            top={triggerPosition.top}
            left={triggerPosition.left}
            zIndex={triggerPosition.zIndex}
            onClose={close}
            title={title_node}
            width={'auto'}
          >
            <div className="flex w-full flex-col gap-y-2 items-end   max-h-[400px] overflow-y-auto">
              <ScheduleFillment userId={'me'} />
              {content}
              {/*<AddScheduleButton onDelete={mutate} onCreated={() => mutate()} />*/}
            </div>
          </PopupBoxChild>
        );
      }}
    </PopupBox>
  );
}

export function CommitmentSection({
  percentage,
  data,
  bg,
  label,
}: {
  percentage: number;
  data: string;
  bg: string;
  label: string;
}) {
  return (
    <>
      <div
        style={{
          width: percentage + '' + '%',
          minWidth: '130px',
        }}
      >
        <h2 className="w-full  text-center leading-border-text -mb-3 ">
          <span className="bg-white text-xs p-1 font-medium">{label}</span>
        </h2>
        <div className={'py-2  text-center    ' + bg}>
          <div className=" text-sm">{data}</div>
        </div>
      </div>
    </>
  );
}

export function ScheduleFillment({ userId }: { userId?: string | number }) {
  const { data: fulfillment, isLoading } = useApi<
    FetchDataType<FulFillmentType>
  >(`/users/${userId}/scheduleCommitment`);

  const fulfillmentData = fulfillment?.data;
  if (fulfillmentData === undefined) return <></>;

  const percent = fulfillmentData.percentage;
  const min = 50;
  const max = 100;
  const mid = 80;

  let bg = 'bg-primary';
  let text = 'text-primary';
  if (percent <= min) {
    bg = 'bg-red-500';
    text = 'text-red-500';
  }

  if (percent >= mid) {
    bg = 'bg-green-500';
    text = 'text-green-500';
  }

  const missingPercent =
    (fulfillmentData.missing / fulfillmentData.total_schedule) * 100;
  const remainingPercent =
    (fulfillmentData.remaining / fulfillmentData.total_schedule) * 100;

  return (
    <div className={'w-full '}>
      {isLoading && <FullLoading />}
      <div className={'mb-1 font-bold'}>This month schedule commitment</div>
      <div className={'flex flex-row items-center  w-full'}>
        <CommitmentSection
          bg={'border-green-500 border-t-2 border-b-2 border-l-2 rounded-l'}
          data={`${formatTime(fulfillmentData.done)} (${fulfillmentData.percentage.toFixed(2)}%)`}
          percentage={fulfillmentData.percentage}
          label={'Done'}
        />

        <CommitmentSection
          bg={'border-red-500 border-t-2 border-b-2'}
          data={`${formatTime(fulfillmentData.missing)} (${missingPercent.toFixed(2)}%)`}
          percentage={missingPercent}
          label={'Missed'}
        />
        <CommitmentSection
          bg={'border-slate-500 border-t-2 border-b-2 border-r-2 rounded-r'}
          data={`${formatTime(fulfillmentData.remaining)} (${remainingPercent.toFixed(2)}%)`}
          percentage={remainingPercent}
          label={'Remaining'}
        />
      </div>

      {fulfillmentData.mustWorkPerDay > 0 && (
        <div className={'my-1   text-red-500'}>
          Need{' '}
          <span className={'font-bold'}>
            +{formatTime(fulfillmentData.mustWorkPerDay)}
          </span>{' '}
          hour/day to touch commitment of total{' '}
          <span className={'font-bold tex'}>
            {formatTime(fulfillmentData.minimumWork, true)} (50% of{' '}
            {formatTime(fulfillmentData.total_schedule, true)} total hours
            scheduled)
          </span>{' '}
          hrs
        </div>
      )}
    </div>
  );
}

{
  /*  <div className={'bg-slate-300 h-[5px] rounded-lg'}>*/
}
{
  /*    <div*/
}
{
  /*        className={'h-full rounded-l-lg ' + bg}*/
}
{
  /*        style={{*/
}
{
  /*          width: fulfillmentData.percentage + '' + '%',*/
}
{
  /*        }}*/
}
{
  /*    />*/
}
{
  /*  </div>*/
}
{
  /*  <p className={'text-center m-1 text-sm font-bold ' + text}>*/
}
{
  /*    {formatTime(fulfillmentData.total_month_activities_in_schedules)} /{' '}*/
}
{
  /*    {formatTime(fulfillmentData.total_month_schedule)} (*/
}
{
  /*    {fulfillmentData.percentage}%)*/
}
{
  /*  </p>*/
}
{
  /*</div>*/
}
