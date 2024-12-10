import { JobType } from "@/types/job";
import PlayJob from "./play";
import PauseJob from "./pause";
import DeleteJob from "./delete";
import DoneJob from "./done";

type Props = {
  job: JobType;
  onDelete?: () => void;
  onStart?: () => void;
  onPause?: () => void;
  onDone?: () => void;
  status?: string;
};
export default function JobActions({
  job,
  onPause,
  onDelete,
  onStart,
  onDone,
  status,
}: Props) {
  return (
    <div className="flex flex-row gap-x-3 items-center">
      {status === "paused" && <PlayJob onStart={onStart} job={job} />}
      {status === "in_progress" && <PauseJob onPause={onPause} job={job} />}
      {/*<DeleteJob job={job} onDelete={onDelete} />*/}
      <DoneJob job={job} onDone={onDone} />
    </div>
  );
}
