import StatusBox from "@/components/shared/status-box";
import { JobType } from "@/types/job";
import CotopiaMention from "@/components/shared-ui/c-mention";

type Props = {
  job: JobType;
};
export default function JobTag({ job }: Props) {
  return (
    <div
      className={"flex flex-wrap gap-1 border rounded-full items-center p-2"}
    >
      <strong className={"text-xs"}>Mentions</strong>
      {job.mentions.map((mention) => {
        return (
          <StatusBox
            label={<CotopiaMention item={mention} />}
            variant="default"
          />
        );
      })}
    </div>
  );
}
