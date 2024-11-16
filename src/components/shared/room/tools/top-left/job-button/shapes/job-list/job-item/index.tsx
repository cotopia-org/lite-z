import { JobType } from "@/types/job";
import EditJobButton from "./edit";
import { limitChar } from "@/lib/utils";
import JobStatus from "./job-status";
import JobActions from "./job-actions";
import JobDate from "./job-date";
import JobTotalHours from "./total-hours";
import JobEstimate from "./estimate";

interface Props {
  item: JobType;
  mutate?: () => void;
}

const JobItem = ({ item, mutate }: Props) => {
  return (
    <div className='flex flex-col gap-y-4 items-start w-full py-4 px-6 border border-grayscale-border rounded-2xl shadow-app-bar'>
      <div className='flex w-full justify-between flex-row items-center gap-x-2'>
        <span className='text-lg text-grayscale-paragraph whitespace-nowrap truncate'>
          {item.title}
        </span>
        <div className='flex flex-row gap-x-3 items-center'>
          <JobActions
            job={item}
            onPause={mutate}
            onStart={mutate}
            onDelete={mutate}
            onDone={mutate}
          />
          <EditJobButton job={item} fetchAgain={mutate} />
        </div>
      </div>
      <p className='text-grayscale-subtitle'>
        {limitChar(item.description, 100)}
      </p>
      <div className='flex flex-wrap w-full items-center gap-2'>
        <JobStatus status={item.status} />
        <JobDate date={item.created_at} />
        <JobEstimate job={item} />
        <JobTotalHours job={item} />
      </div>
    </div>
  );
};

export default JobItem;
