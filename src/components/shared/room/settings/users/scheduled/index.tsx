import React from "react";
import { useRoomContext } from "../../../room-context";
import SchedulesSummary from "@/components/shared/schedules-summary";
import moment from "moment";
import {ScheduleType} from "@/types/calendar";
import {WorkspaceUserType} from "@/types/user";



type Props = {
  finalSchedules: ScheduleType[];
};

export default function ScheduledUsers({finalSchedules}:Props) {


  return <SchedulesSummary schedules={finalSchedules} />;
}
