import JobItem from "../room/tools/top-left/job-button/shapes/job-list/job-item";
import { JobType } from "@/types/job";

type Props = {
  items: JobType[];
  onMutate?: () => void;
  hasAction?: boolean;
};
export default function JobItems({
  items,
  onMutate,
  hasAction = false,
}: Props) {
  if (items.length === 0) return null;
  return (
    <div className='flex flex-col w-full gap-y-4 max-h-[350px] py-2 overflow-auto'>
      {items.map((item, key) => {
        return (
          <JobItem
            hasAction={hasAction}
            mutate={onMutate}
            item={item}
            key={key + 1}
          />
        );
      })}
    </div>
  );
}
