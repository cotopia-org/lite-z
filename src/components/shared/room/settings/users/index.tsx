import WorkingUsers from "./working";
import OfflineUsers from "./offline";
import ScheduledUsers from "./scheduled";

export default function WorkspaceUsers() {
  return (
    <div className='flex flex-col gap-y-8 p-4'>
      <WorkingUsers />
      <ScheduledUsers />
      <OfflineUsers />
    </div>
  );
}
