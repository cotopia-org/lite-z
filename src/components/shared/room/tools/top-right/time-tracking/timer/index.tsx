import { __BUS } from "@/const/bus";
import { cn, convertMinutesToHHMMSS } from "@/lib/utils";
import { ReactNode, useEffect, useState } from "react";
import useBus from "use-bus";

type Props = {
  initialSeconds: number;
  children: (time: string) => ReactNode;
  id?: string;
  stop?: boolean;
  short?: boolean;
};

export default function Timer({
  initialSeconds,
  children,
  id,
  stop = false,
  short = false,
}: Props) {
  const [status, setStatus] = useState<"normal" | "stopped">("normal");

  let timer: NodeJS.Timeout;

  const [seconds, setSeconds] = useState<number>(initialSeconds);
  useEffect(() => {
    if (initialSeconds !== undefined) setSeconds(initialSeconds);
  }, [initialSeconds]);

  const startTimer = () => {
    timer = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timer);
  };

  useEffect(() => {
    if (!stop) startTimer();

    // Cleanup the interval on component unmount
    return () => stopTimer();
  }, [stop]);

  useBus(
    __BUS.stopWorkTimer,
    (evt) => {
      if (evt.id === id) stopTimer();
      setStatus("stopped");
    },
    [id]
  );

  useBus(
    __BUS.startWorkTimer,
    (evt) => {
      if (evt.id === id) startTimer();
      setStatus("normal");
    },
    [id]
  );

  return (
    <span className={cn(status === "stopped" ? "text-red-600" : "")}>
      {children(convertMinutesToHHMMSS((seconds ?? 0) / 60, short))}
    </span>
  );
}
