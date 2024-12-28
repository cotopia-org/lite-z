import { formatTime, getDateTime } from "@/lib/utils";
import { UserJobType } from "@/types/job";

import JobStatus from "@/components/shared/room/tools/top-left/job-button/shapes/job-list/job-item/job-status";
import CotopiaAvatar from "@/components/shared-ui/c-avatar";

export default function UserJob({ user }: { user: UserJobType }) {
  return (
    <div className={"flex flex-col gap-y-2 items-start border rounded w-full"}>
      <div
        className={
          "flex flex-row gap-x-2 items-start justify-between border-b p-2 w-full"
        }
      >
        <div className={"flex gap-2 items-center"}>
          <CotopiaAvatar
            date={0}
            className={`min-w-8 min-h-8`}
            src={user.avatar?.url}
            title={user.username ? user.username?.[0] : undefined}
          />
          <div className={"flex flex-col"}>
            {user.username}

            <small>{user.role}</small>
          </div>
        </div>
        {/*Remove Member*/}
        {/*<div>*/}
        {/*  <PropmptBox*/}
        {/*    submitLabel={"Delete"}*/}
        {/*    submitVariant={"destructive"}*/}
        {/*    title={`Remove ${user.username} from this job?`}*/}
        {/*    trigger={(open) => {*/}
        {/*      return (*/}
        {/*        <CotopiaIconButton*/}
        {/*          onClick={() => {*/}
        {/*            open();*/}
        {/*          }}*/}
        {/*          disabled={false}*/}
        {/*          className="hover:text-black w-5 h-5"*/}
        {/*        >*/}
        {/*          <X color={colors.error.default} size={16} />*/}
        {/*        </CotopiaIconButton>*/}
        {/*      );*/}
        {/*    }}*/}
        {/*    onSubmit={() => {*/}
        {/*      console.log("Submit");*/}
        {/*    }}*/}
        {/*    onClose={() => {*/}
        {/*      console.log("close");*/}
        {/*    }}*/}
        {/*  />*/}
        {/*</div>*/}
      </div>

      <div className={"flex flex-col p-2 w-full"}>
        <span>
          <JobStatus status={user.status} />
        </span>
        <span>{formatTime(user.total_minutes)}</span>
        <span>{getDateTime(user.created_at)}</span>
      </div>
    </div>
  );
}
