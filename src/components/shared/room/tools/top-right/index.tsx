import Notifications from './notifications';
import PayrollButton from './payroll-button';
import TimeTrackingButtonTool from './time-tracking';

export default function TopRightTools() {
  return (
    <div className="flex flex-row items-center gap-x-2">
      <TimeTrackingButtonTool />
      <PayrollButton />
      <Notifications />
      {/* <InviteButtonTool /> */}
      {/* <MeetButtonTool /> */}
      {/* <UserActionsGroup /> */}
      {/* <ChatActionsGroup /> */}
    </div>
  );
}
