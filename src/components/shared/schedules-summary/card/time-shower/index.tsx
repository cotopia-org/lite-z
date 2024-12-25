import { ScheduleType } from "@/types/calendar";
import Time from "./time";

type Props = {
  times: ScheduleType["days"][0]["times"];
};

export default function TimeShower({ times }: Props) {
  if (times.length === 0) return null;

  return (
    <>
      {times.map((x, index) => (
        <Time key={index} time={x} />
      ))}
    </>
  );
}
