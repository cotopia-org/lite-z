// import React from "react";
// import MeetButtonTool from "./meet";
// import UserActionsGroup from "./user-actions-group";
// import ChatActionsGroup from "./chat-actions-group";
import PayrollButton from './payroll-button';
import TimeTrackingButtonTool from './time-tracking';

export default function TopRightTools() {
  return (
    <div className="flex flex-row items-center gap-x-2">
      <TimeTrackingButtonTool />
      <PayrollButton />
      {/* <InviteButtonTool /> */}
      {/* <MeetButtonTool /> */}
      {/* <UserActionsGroup /> */}
      {/* <ChatActionsGroup /> */}
    </div>
  );
}
