import { convertMinutesToHHMMSS } from "@/lib/utils";
import React, { useEffect } from "react";
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
            "flex flex-row items-center justify-between p-2 border-b last:border-0";

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
              <div className='flex flex-col items-end gap-y-2 w-[80px]'>
                {hasCount ? (
                  <>
                    <Timer
                      initialSeconds={item.working_minutes * 60}
                      stop={userActiveJob === null}
                    >
                      {(time) => (
                        <CotopiaTooltip title='Working time'>
                          <strong className='text-xs'>{time}</strong>
                        </CotopiaTooltip>
                      )}
                    </Timer>
                    <Timer
                      initialSeconds={item.idle_minutes * 60}
                      stop={userActiveJob !== null}
                    >
                      {(time) => (
                        <CotopiaTooltip title='Idle time'>
                          <strong className='text-xs flex flex-row items-center gap-x-1 text-yellow-600'>
                            {time}
                          </strong>
                        </CotopiaTooltip>
                      )}
                    </Timer>
                  </>
                ) : (
                  <>
                    <CotopiaTooltip title='Working time'>
                      <span className='text-xs opacity-85'>
                        {convertMinutesToHHMMSS(item.working_minutes)}
                      </span>
                    </CotopiaTooltip>
                    <CotopiaTooltip title='Idle time'>
                      <span className='text-xs opacity-85 text-yellow-600'>
                        {convertMinutesToHHMMSS(item.idle_minutes)}
                      </span>
                    </CotopiaTooltip>
                  </>
                )}
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
