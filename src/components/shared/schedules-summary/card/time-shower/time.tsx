import { ScheduleType } from "@/types/calendar";

type Props = {
  time: ScheduleType["days"][0]["times"][0];
};
export default function Time({ time }: Props) {
  return (
    <span className="text-sm text-black/60">{`${time.start} - ${time.end}`}</span>
  );
}
