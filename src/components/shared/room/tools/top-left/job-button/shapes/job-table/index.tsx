import FullLoading from "@/components/shared/full-loading";

import { JobType } from "@/types/job";
import JobStatus from "@/components/shared/room/tools/top-left/job-button/shapes/job-table/job-item/job-status";

interface Props {
  items: JobType[];
  loading: boolean;
  userId: number;
}

const JobTable = (props: Props) => {
  const getUserTotalHours = (item: JobType) => {
    const user = item.members.find((member) => member.id === props.userId);
    if (user) {
      if (user.total_minutes) {
        return user.total_minutes;
      }
    }

    return 0;
  };

  if (!props.loading && props.items.length === 0)
    return (
      <span className="w-full text-lg text-grayscale-paragraph font-medium text-center py-4">
        There is no job to show!
      </span>
    );

  if (props.loading) return <FullLoading />;

  return (
    <div className="max-h-[400px] overflow-auto">
      <div className={"flex flex-row justify-between p-2 w-full border-b"}>
        <div className={"text-sm flex flex-row   items-center gap-x-1"}>
          Job
        </div>

        <div className={"text-sm flex flex-row   items-center gap-x-1"}>
          Time(hr)/Estimated(hr)
        </div>
      </div>

      {props.items.map((job) => {
        return (
          <div
            className={"flex flex-row justify-between items-center p-2 w-full "}
          >
            <div className={"text-sm flex flex-row   items-center gap-x-1"}>
              <JobStatus status={job.status} />{" "}
              {job.title.length > 20
                ? job.title.slice(0, 20) + "... "
                : job.title}
            </div>

            <div className={"text-sm flex flex-row  items-center gap-x-1"}>
              {Math.round((job.total_minutes ? job.total_minutes : 0) / 60)} /{" "}
              {job.estimate === null ? 0 : job.estimate}
            </div>
          </div>
        );
      })}

      <div
        className={
          "flex flex-row justify-between items-center p-2 w-full bottom-0 sticky bg-slate-100"
        }
      >
        <div className={"text-sm flex flex-row   items-center gap-x-1"}>
          <strong>Total</strong>
        </div>

        <div className={"text-sm flex flex-row  items-center gap-x-1"}>
          <strong>
            ~
            {Math.round(
              props.items.reduce(
                (sum, item) =>
                  sum + (item.total_minutes ? item.total_minutes : 0),
                0,
              ) / 60,
            )}{" "}
            /{" "}
            {Math.round(
              props.items.reduce((sum, item) => sum + item.estimate, 0),
            )}
          </strong>
        </div>
      </div>
    </div>
  );
};

export default JobTable;
