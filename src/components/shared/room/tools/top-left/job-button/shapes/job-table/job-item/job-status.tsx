import type { StatusBoxVariant } from "@/components/shared/status-box";
import StatusBox from "@/components/shared/status-box";
import { JobStatusType } from "@/types/job";
import {Check, Pause,Play} from "lucide-react";
import {colors} from "@/const/varz";
interface Props {
  status: JobStatusType;
}

const JobStatus = ({ status }: Props) => {
  let statusVariant: StatusBoxVariant = "default";


  switch (status) {
    case "in_progress":
      return <Play size={14} color={colors.primary.default}/>;
    case "paused":
      return <Pause size={14} color={colors.warning.default}/>;
    case "completed":
      return <Check size={14} color={colors.success.default}/>;

    default:
      return <></>
  }

};

export default JobStatus;
