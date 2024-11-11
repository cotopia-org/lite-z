import { JobType } from "@/types/job";
import { limitChar } from "@/lib/utils";
import JobStatus from "../job-status";

interface Props {
  item: JobType;
}

const JobItemRead = ({ item }: Props) => {
  return (
    <div className="flex flex-col gap-y-4 items-start w-full py-4 px-6 border border-grayscale-border rounded-lg shadow-app-bar">
      <div className="flex w-full justify-between flex-row items-center gap-x-2">
        <span className="text-lg text-grayscale-paragraph whitespace-nowrap truncate">
          {item.title}
        </span>
        <div className="flex flex-row gap-x-3 items-center">
          <JobStatus status={item.status} />
        </div>
      </div>
      <p className="text-grayscale-subtitle">
        {limitChar(item.description, 100)}
      </p>
    </div>
  );
};

export default JobItemRead;
