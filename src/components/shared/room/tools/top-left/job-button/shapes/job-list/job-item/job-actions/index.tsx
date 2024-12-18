import { JobType } from "@/types/job";
import PlayJob from "./play";
import PauseJob from "./pause";
import DeleteJob from "./delete";
import DoneJob from "./done";
import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import { TickCircleIcon } from "@/components/icons";
import { colors } from "@/const/varz";
import { MessageCircle } from "lucide-react";

type Props = {
  job: JobType;
  onDelete?: () => void;
  onStart?: () => void;
  onPause?: () => void;
  onDone?: () => void;
  openChat?: () => void;
  status?: string;
};
export default function JobActions({
  job,
  onPause,
  onDelete,
  onStart,
  onDone,
  status,
  openChat,
}: Props) {
  return (
    <div className="flex flex-row gap-x-3 items-center">
      {status === "paused" && <PlayJob onStart={onStart} job={job} />}
      {status === "in_progress" && <PauseJob onPause={onPause} job={job} />}
      {/*<DeleteJob job={job} onDelete={onDelete} />*/}
      <DoneJob job={job} onDone={onDone} />

      <CotopiaIconButton
        onClick={() => {
          if (openChat) openChat();
        }}
        className="hover:text-black w-5 h-5"
      >
        <MessageCircle color={colors.primary.default} size={16} />
      </CotopiaIconButton>
    </div>
  );
}
