import CotopiaButton from '@/components/shared-ui/c-button';
import CDateInput from '@/components/shared-ui/c-date-input';
import CotopiaDropdown from '@/components/shared-ui/c-dropdown';
import TimePicker from '@/components/shared/time-picker';
import { useLoading, useValues } from '@/hooks';
import { useApi } from '@/hooks/swr';
import { cn } from '@/lib/utils';
import { FetchDataType } from '@/services/axios';
import { AvailabiltyType } from '@/types/calendar';
import { WorkspaceType } from '@/types/workspace';
import { useState } from 'react';

type Props = {
  onClose: () => void;
  onAdd: (availability: AvailabiltyType) => void;
};
export default function AddAvailability({ onClose }: Props) {
  const { values, changeKey } = useValues<{
    selectedWorkspace?: string;
    timeStart?: string;
    timeEnd?: string;
  }>({
    selectedWorkspace: undefined,
    timeEnd: undefined,
    timeStart: undefined,
  });

  const [selectedWorkspace, setSelectedWorkspace] = useState<string>();

  const { data, isLoading: isWorkspaceLoading } =
    useApi<FetchDataType<WorkspaceType[]>>(`/workspaces`);
  const items: WorkspaceType[] = !!data ? data?.data : [];

  const { startLoading, stopLoading, isLoading } = useLoading();
  const handleAddAvailibility = () => {
    startLoading();
    // axiosInstance.post(`/availabilities`, {
    //     date_start:
    // })
  };

  return (
    <div className="flex flex-col gap-y-4">
      <strong>Availability</strong>
      <CotopiaDropdown
        items={items.map((a) => ({
          title: a.title,
          value: '' + a.id,
        }))}
        onSelect={(item) => setSelectedWorkspace(item.value)}
        defaultValue={selectedWorkspace}
        className={cn(
          isWorkspaceLoading ? 'pointer-events-none opacity-50' : '',
        )}
      />
      {JSON.stringify(values.timeStart)}
      <TimePicker
        label="Time start"
        value={values.timeStart}
        onChange={(time) => changeKey('timeStart', time)}
        format="12"
      />
      <TimePicker
        label="Time end"
        value={values.timeEnd}
        onChange={(time) => changeKey('timeEnd', time)}
        format="12"
      />
      <CotopiaButton
        type="button"
        loading={isLoading}
        className="min-w-[140px]"
        onClick={handleAddAvailibility}
      >
        Add
      </CotopiaButton>
    </div>
  );
}
