import { JobType } from "@/types/job";
import JobItemRead from "../room/tools/top-left/job-button/shapes/job-list/job-item/job-item-read";
import NotFound from "../layouts/not-found";

type Props = {
  items: JobType[];
};
export default function Jobs({ items }: Props) {
  if (items.length === 0)
    return (
      <NotFound title="There is no job for this user yet!" className="py-6" />
    );

  return (
    <div className="flex w-full flex-col gap-y-4 items-end">
      {items.map((x) => (
        <JobItemRead item={x} key={x.id} />
      ))}
    </div>
  );
}
