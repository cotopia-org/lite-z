import useLoading from "@/hooks/use-loading";
import { useEffect, useState } from "react";
import { urlWithQueryParams } from "@/lib/utils";
import PopupBox from "@/components/shared/popup-box";
import TimeTrackingDetails from "./details";
import TimeTrackingButton from "./button";
import PopupBoxChild from "@/components/shared/popup-box/child";
import axiosInstance from "@/services/axios";

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
      trigger={(open) => (
        <TimeTrackingButton
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
            onClose={close}
            title='Leaderboard'
            width={300}
          >
            <TimeTrackingDetails />
          </PopupBoxChild>
        );
      }}
    </PopupBox>
  );
}
