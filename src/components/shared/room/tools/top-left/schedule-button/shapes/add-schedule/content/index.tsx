import { useEffect, useState } from 'react';
import Day from './day';
import CotopiaButton from '@/components/shared-ui/c-button';
import { Save } from 'lucide-react';
import useLoading from '@/hooks/use-loading';
import TitleEl from '@/components/shared/title-el';
import AvailabilityType from './availability';
import { AvailabiltyType, ScheduleType } from '@/types/calendar';
import { toast } from 'sonner';
import DeleteEvent from '../delete-event';
import CotopiaSwitch from '@/components/shared-ui/c-switch';
import CDateInput from '@/components/shared-ui/c-date-input';
import moment from 'moment';
import { useRoomContext } from '@/components/shared/room/room-context';
import axiosInstance from '@/services/axios';

export type ScheduleDayType = {
  index: number;
  times: { from: string; to: string }[];
  availability_type: AvailabiltyType;
  selected: boolean;
};

//Todo - Refactor defaultId and defaultValue to schedule object
type Props = {
  onClose: () => void;
  defaultId?: number;
  defaultValue?: {
    availability_type: AvailabiltyType;
    days: { [key: number]: ScheduleDayType };
    is_recurrence?: boolean;
    recurrence_start?: string;
    recurrence_end?: string;
    contract_id?: number;
  };
  onDelete?: () => void;
  onUpdate?: (item: ScheduleType) => void;
  onCreated?: (item: ScheduleType) => void;
  user_id?: number;
  contract_id?: number;
};

export default function AddScheduleContent({
  onClose,
  defaultId,
  defaultValue,
  onDelete,
  onCreated,
  onUpdate,
  user_id,
  contract_id,
}: Props) {
  const { workspace_id } = useRoomContext();

  const isEdit = defaultValue !== undefined && defaultId !== undefined;

  const [daysValue, setDaysValue] = useState<{
    [key: number]: ScheduleDayType;
  }>();

  const [contractId, setContractId] = useState<number | undefined>(contract_id);
  useEffect(() => {
    if (defaultValue !== undefined) {
      const { days, contract_id } = defaultValue;

      setDaysValue(days);
      setContractId(contract_id);
    }
  }, [defaultValue]);

  const days = Array.from(Array(7).keys());

  useEffect(() => {
    if (daysValue !== undefined) return;
  }, [daysValue]);

  const handleChangeDay = (index: number, day: ScheduleDayType) => {
    setDaysValue((prev) => {
      const prevDays: any = prev !== undefined ? prev : {};

      prevDays[index] = day;

      return prevDays;
    });
  };

  const { startLoading, stopLoading, isLoading } = useLoading();
  console.log('HERE', contractId);

  const handleSubmitEvent = () => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (daysValue === undefined) return;

    startLoading();
    let payload: { [key: string]: any } = {
      timezone: userTimeZone,
      workspace_id,
    };

    const daysArray = Object.keys(daysValue)
      .map((x) => ({ day: daysValue[+x], dayIndex: x }))
      .filter((x) => x.day.selected)
      .map((x) => ({
        day: +x.dayIndex,
        times: x.day.times.map((a) => ({
          start: a.from,
          end: a.to,
        })),
      }));

    payload['days'] = daysArray;

    if (user_id) payload['user_id'] = user_id;
    if (contractId) payload['contract_id'] = contractId;

    axiosInstance({
      url: isEdit ? `/schedules/${defaultId}` : `/schedules`,
      method: isEdit ? 'PUT' : 'POST',
      data: payload,
    })
      .then((res) => {
        toast.success(
          isEdit ? 'Schedule has been updated' : 'Schedule has been created',
        );
        if (!isEdit) {
          if (onCreated) onCreated(res.data?.data);
        } else {
          if (onUpdate) onUpdate(res.data?.data);
        }
        if (onClose) onClose();

        stopLoading();
      })
      .catch(() => {
        stopLoading();
      });
  };

  return (
    <div className="flex flex-col gap-y-8">
      <TitleEl title="Days">
        <div className="flex flex-col gap-y-6">
          {days.map((dayNumber, index) => {
            const day = daysValue?.[dayNumber];
            return (
              <div className="day" key={index}>
                <Day
                  index={index}
                  day={day}
                  onChange={(dayValue) => handleChangeDay(index, dayValue)}
                />
                <hr className="mt-6" />
              </div>
            );
          })}
        </div>
      </TitleEl>

      <div className="flex flex-row justify-end gap-x-2">
        <CotopiaButton
          variant={'outline'}
          className="min-w-[120px]"
          onClick={onClose}
        >
          Close
        </CotopiaButton>
        {isEdit && (
          <DeleteEvent
            eventId={defaultId}
            onDelete={() => onDelete && onDelete()}
          />
        )}
        <CotopiaButton
          onClick={handleSubmitEvent}
          startIcon={<Save size={16} />}
          className="min-w-[160px]"
          loading={isLoading}
          disabled={daysValue === undefined}
        >
          {isEdit ? 'Update' : 'Create'}
        </CotopiaButton>
      </div>
    </div>
  );
}
