import useLoading from "@/hooks/use-loading";
import axiosInstance from "@/services/axios";
import React, { useEffect, useState } from "react";
import { urlWithQueryParams } from "@/lib/utils";
import PopupBox from "@/components/shared/popup-box";
import TimeTrackingDetails from "./details";
import TimeTrackingButton from "./button";
import PopupBoxChild from "@/components/shared/popup-box/child";
import Rank from "@/components/shared/room/tools/top-right/time-tracking/details/rank";
import UserAvatar from "@/components/shared/user-avatar";
import {useRoomContext} from "@/components/shared/room/room-context";
import useAuth from "@/hooks/auth";
import {useApi} from "@/hooks/swr";
import {LeaderboardType} from "@/types/leaderboard";
import UserJobList from "@/components/shared/room/participant-detail/details/jobs/user-jobs";
import {UserType} from "@/types/user";
import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import {ArrowLeft} from "lucide-react";

export default function TimeTrackingButtonTool() {
  const [seconds, setSeconds] = useState<undefined | number>();

  const { startLoading, stopLoading, isLoading } = useLoading();
  const getActivityTime = () => {
    startLoading();
    axiosInstance
      .get(urlWithQueryParams(`/users/activities`, { period: "today" }))
      .then((res) => {
        const mins = res.data.data;
        setSeconds(mins * 60);
        stopLoading();
      })
      .catch((err) => {
        stopLoading();
      });
  };
  useEffect(() => {
    getActivityTime();
  }, []);

    const { workspace_id, workspaceUsers } = useRoomContext();



    const [selectedUser,setSelectedUser] = useState<UserType|null>(null)



    const { data: leaderboardData } = useApi(
        `/workspaces/${workspace_id}/leaderboard`
    );

    const leaderboard: LeaderboardType[] = leaderboardData?.data ?? [];

    let header =<>Leaderboard</>
  let content = (<>

      <div className='flex flex-col items-end w-full'>
          <div className={'flex flex-row gap-x-2  mb-4'}>
                        <span className={'text-xs w-[40px]'}>
                            Jobs
                        </span>
              <span className={'text-xs w-[40px] text-yellow-600'}>
                            Idle
                        </span>
          </div>
      </div>
      <TimeTrackingDetails leaderboard={leaderboard} workspaceUsers={workspaceUsers}
                           setSelectedUser={setSelectedUser}/></>)


    if (selectedUser !== null) {
        content = <UserJobList userId={selectedUser.id}/>
        const userAvatar = workspaceUsers.find(
            (x) => x.id === selectedUser.id
        )?.avatar;
        header = <div className='flex flex-row items-center gap-x-2'>
            <UserAvatar title={selectedUser.name} src={userAvatar?.url}/>
            <span className='text-xs'>{selectedUser.name ?? "-"}</span>
        </div>

    }


    return (<PopupBox
        trigger={(open, isOpen) => (
            <TimeTrackingButton
                isOpen={isOpen}
                defaultSeconds={seconds ?? 0}
                onClick={open}
                isLoading={isLoading}
            />
        )}
    >
    {(style, open, close) => {
            return (
                <PopupBoxChild
                    {...style}
                    left={style.left - style.width - (selectedUser === null ? 28 : 176)}
                    onClose={close}
                    title={header}
                    width={selectedUser === null ? 300 : 450}
                    button={      selectedUser && <CotopiaIconButton
                        onClick={()=>{
                            setSelectedUser(null)
                        }}
                        className="w-5 h-5 opacity-80 hover:opacity-100"
                    >
                        <ArrowLeft className="text-grayscale-subtitle w-4 h-4" />
                    </CotopiaIconButton>}
              >


                  {content}
              </PopupBoxChild>
          );
      }}
  </PopupBox>);
}
