import { convertMinutesToHHMMSS } from "@/lib/utils";
import React, {ReactNode} from "react";
import Timer from "../timer";
import { useRoomContext } from "@/components/shared/room/room-context";
import UserAvatar from "@/components/shared/user-avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import Rank from "./rank";
import BlurFade from "@/components/magicui/blur-fade";
import { useApi } from "@/hooks/swr";
import { LeaderboardType } from "@/types/leaderboard";
import useAuth from "@/hooks/auth";
import { AlarmClockOff } from "lucide-react";
import CotopiaTooltip from "@/components/shared-ui/c-tooltip";
import {JobType} from "@/types/job";

type Props = {
  hasCount: boolean;
  userActiveJob: JobType|null|undefined;
  item: LeaderboardType ;
};


function Timers ({hasCount,userActiveJob,item}:Props) {
return                <>
  {hasCount ? (
      <div className={'flex flex-row gap-x-2 items-start justify-between'}>
        <Timer
            initialSeconds={item.working_minutes * 60}
            stop={userActiveJob === null}
            short={true}
        >
          {(time) => (
                <strong className='text-xs w-[40px]'>{time}</strong>
          )}
        </Timer>
        <Timer
            initialSeconds={item.idle_minutes * 60}
            stop={userActiveJob !== null}
            short={true}

        >
          {(time) => (
                <strong className='text-xs w-[40px] text-yellow-600'>
                  {time}
                </strong>
          )}
        </Timer>

      </div>
  ) : (
      <div className={'flex flex-row gap-x-2 items-start justify-between'}>
                      <span className='text-xs opacity-85 w-[40px]'>
                        {convertMinutesToHHMMSS(item.working_minutes,true)}
                      </span>
                      <span className='text-xs opacity-85 w-[40px] text-yellow-600'>
                        {convertMinutesToHHMMSS(item.idle_minutes,true)}
                      </span>

      </div>
  )}</>
}
export default function TimeTrackingDetails() {
  const { workspace_id, workspaceUsers } = useRoomContext();

  const { user } = useAuth();

  const { data: leaderboardData } = useApi(
    `/workspaces/${workspace_id}/leaderboard`
  );

  const leaderboard: LeaderboardType[] = leaderboardData?.data ?? [];

  let content = (
    <>
      {leaderboard
        .sort((a, b) => b.sum_minutes - a.sum_minutes)
        .map((item, key) => {
          const isMe = item.user.id === user?.id;

          let clss =
            "flex flex-row items-center justify-between p-2 border-b last:border-0 hover:bg-blue-100 hover:cursor-pointer";

          if (isMe) clss += ` bg-sky-300`;

          const hasCount =
            (item?.user?.status === "online" && item.user?.room_id !== null) ||
            isMe;

          const userAvatar = workspaceUsers.find(
            (x) => x.id === item.user.id
          )?.avatar;
          const userActiveJob = workspaceUsers.find(
            (x) => x.id === item.user.id
          )?.active_job;

          return (
            <BlurFade
              inView
              className={clss}
              key={key}
              delay={0.05 + key * 0.05}


            >
              <div className='flex flex-row items-center gap-x-2'>
                <Rank rank={key + 1} />
                <UserAvatar title={item.user?.name} src={userAvatar?.url} />
                <span className='text-xs'>{item.user?.name ?? "-"}</span>
              </div>
              <div className='flex flex-col   w-[80px] justify-between'>
                  <Timers hasCount={hasCount} userActiveJob={userActiveJob} item={item}/>
              </div>
            </BlurFade>
          );
        })}
    </>
  );

  return (
    <ScrollArea className='h-72 flex flex-col gap-y-4 w-full'>
      {content}
    </ScrollArea>
  );
}
