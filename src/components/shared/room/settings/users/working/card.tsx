import { WorkspaceUserType } from "@/types/user";
import ParticipantsWithPopover from "@/components/shared/participants/with-popover";

type Props = {
  user: WorkspaceUserType;
};

export default function WorkingCard({ user }: Props) {
  return (
    <div className='flex flex-row gap-x-2 items-center'>
      <ParticipantsWithPopover className='!pb-0' participants={[user]} />
      <div className='flex flex-col'>
        <span className='text-sm capitalize font-medium'>{`${user.name} (${user.active_job?.total_hours})`}</span>
        <span className='text-xs text-black/70'>
          {user.active_job?.title ?? "Idle"}
        </span>
      </div>
    </div>
  );
}
