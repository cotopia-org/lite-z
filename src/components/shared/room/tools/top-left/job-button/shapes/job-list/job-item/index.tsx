import { JobType } from "@/types/job";
import EditJobButton from "./edit";
import { limitChar } from "@/lib/utils";
import JobStatus from "./job-status";
import JobActions from "./job-actions";
import JobEstimate from "./estimate";
import JobParent from "./parent";
import JobTag from "./tag";
import { UserRoundCheck, UserRoundX } from "lucide-react";
import moment from "moment/moment";
import CotopiaTooltip from "@/components/shared-ui/c-tooltip";
import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import { colors } from "@/const/varz";
import useLoading from "@/hooks/use-loading";
import axiosInstance from "@/services/axios";
import { toast } from "sonner";
import { UserType } from "@/types/user";
import { __BUS } from "@/const/bus";
import { useChat2 } from "@/hooks/chat/use-chat-2";
import { dispatch } from "use-bus";

interface Props {
  item: JobType;
  mutate?: () => void;
  hasAction?: boolean;
  suggested?: boolean;
  user?: UserType | null;
  parentJobs: JobType[];
}

const JobItem = ({
  item,
  mutate,
  hasAction = false,
  suggested = false,
  parentJobs,
  user,
}: Props) => {
  const { startLoading, stopLoading, isLoading } = useLoading();

  const handleAcceptJob = (jobId: number) => {
    startLoading();
    axiosInstance
      .get(`/jobs/${jobId}/accept`)
      .then((res) => {
        toast.success("Job has been accepted and started");
        stopLoading();
        if (mutate) {
          mutate();
        }
      })
      .catch(() => {
        stopLoading();
      });
  };
  const handleDismissJob = (jobId: number) => {
    startLoading();
    axiosInstance
      .get(`/jobs/${jobId}/dismiss`)
      .then((res) => {
        toast.success("Job has been dismissed");
        stopLoading();
        if (mutate) {
          mutate();
        }
      })
      .catch(() => {
        stopLoading();
      });
  };

  const { chats } = useChat2();
  const chat = chats[0];

  const handleOpenChat = () => {
    console.log("Open CHat");
    dispatch({
      type: __BUS.selectChat,
      chat,
    });
  };

  return (
    <div className="flex flex-col gap-y-4 items-start w-full py-4 px-6 border border-grayscale-border rounded-2xl shadow-app-bar">
      <div className="flex w-full justify-between flex-row items-center gap-x-2">
        <div className={"flex flex-col justify-center"}>
          <span className="text-lg text-grayscale-paragraph text-ellipsis whitespace-pre-wrap">
            <CotopiaTooltip
              triggerClassName={"truncate max-w-48"}
              title={item.title}
            >
              {item.title}
            </CotopiaTooltip>
          </span>

          <small className={"text-xs text-slate-400"}>
            {moment(item.created_at).fromNow()}
          </small>
        </div>
        {!!hasAction && (
          <div className="flex flex-row gap-x-3 items-center">
            <JobActions
              job={item}
              status={item.status}
              onPause={mutate}
              onStart={mutate}
              onDelete={mutate}
              onDone={mutate}
              openChat={handleOpenChat}
            />

            {item.role === "owner" && (
              <EditJobButton
                job={item}
                parentJobs={parentJobs}
                fetchAgain={mutate}
              />
            )}
          </div>
        )}

        {!!suggested && (
          <div className="flex flex-row gap-x-3 items-center">
            <CotopiaIconButton
              onClick={() => {
                handleAcceptJob(item.id);
              }}
              disabled={false}
              className="text-black/60 hover:text-black w-5 h-5"
            >
              <UserRoundCheck color={colors.success.default} size={16} />
            </CotopiaIconButton>
            <CotopiaIconButton
              onClick={() => {
                handleDismissJob(item.id);
              }}
              disabled={false}
              className="text-black/60 hover:text-black w-5 h-5"
            >
              <UserRoundX color={colors.destructive} size={16} />
            </CotopiaIconButton>
          </div>
        )}
      </div>
      <p className="text-grayscale-subtitle">
        {limitChar(item.description, 100)}
      </p>

      <div className={"flex flex-col gap-y-2 w-full"}>
        <div className={"flex flex-row gap-4"}>
          {!suggested && (
            <>
              <div>
                <JobStatus status={item.status} />
              </div>
              <div>
                <JobEstimate job={item} />
              </div>
            </>
          )}
          <div>{item.parent && <JobParent job={item} />}</div>
        </div>
        {item.mentions.length > 0 && (
          <div className={"w-fit"}>
            <JobTag job={item} />
          </div>
        )}
      </div>
    </div>
  );
};

export default JobItem;
