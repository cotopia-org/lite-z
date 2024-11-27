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

  return (
    <PopupBox
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
        console.log("style", style);
        return (
            <PopupBoxChild
                {...style}
                left={style.left - style.width - 28}
                onClose={close}
                title='Leaderboard'
                width={300}
            >


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
                <TimeTrackingDetails/>
            </PopupBoxChild>
        );
      }}
    </PopupBox>
  );
}
