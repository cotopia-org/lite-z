import CotopiaButton from "@/components/shared-ui/c-button";
import PopupBox from "@/components/shared/popup-box";
import PopupBoxChild from "@/components/shared/popup-box/child";
import { CalendarDays } from "lucide-react";
import { useMemo } from "react";
import ShapesHandler from "./shapes/handler";
import { useRoomContext } from "../../../room-context";
import useAuth from "@/hooks/auth";

export default function ScheduleButton() {
  const { user } = useAuth();
  const { workpaceUsers } = useRoomContext();

  const totalHours = useMemo(() => {
    return workpaceUsers.find((x) => x.id === user?.id)?.schedule_hours_in_week
      ?.hours;
  }, [workpaceUsers, user]);
  return (
    <PopupBox
      trigger={(open) => (
        <CotopiaButton
          onClick={open}
          startIcon={<CalendarDays />}
          className='bg-white hover:bg-white text-black rounded-xl'
        >
          Schedule
        </CotopiaButton>
      )}
      className='w-[551px]'
    >
      {(triggerPosition, open, close) => (
        <PopupBoxChild
          top={triggerPosition.top}
          left={triggerPosition.left}
          zIndex={triggerPosition.zIndex}
          onClose={close}
          title={`Schedule (${totalHours ?? 0}h) per week`}
          width={400}
        >
          <ShapesHandler />
        </PopupBoxChild>
      )}
    </PopupBox>
  );
}
