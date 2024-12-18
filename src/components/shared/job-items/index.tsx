import NotFound from "../layouts/not-found";
import JobItem from "../room/tools/top-left/job-button/shapes/job-list/job-item";
import { JobType } from "@/types/job";
import { UserType } from "@/types/user";

type Props = {
  items: JobType[];
  onMutate?: () => void;
  hasAction?: boolean;
  suggested?: boolean;
  user?: UserType | null;
  parentJobs: JobType[];
};
export default function JobItems({
  items,
  onMutate,
  hasAction = false,
  suggested = false,
  user,
  parentJobs,
}: Props) {
  if (items.length === 0) return <NotFound title="No job yet! 😞" />;
  return (
    <div className="flex flex-col w-full gap-y-4 max-h-[350px] py-2 overflow-auto">
      {items.map((item, key) => {
        return (
          <JobItem
            parentJobs={parentJobs}
            user={user}
            hasAction={hasAction && !suggested}
            suggested={suggested}
            mutate={onMutate}
            item={item}
            key={key + 1}
          />
        );
      })}
    </div>
  );
}
