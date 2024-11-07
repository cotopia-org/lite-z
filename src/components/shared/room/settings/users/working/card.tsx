import { WorkspaceUserType } from "@/types/user";
import ParticipantsWithPopover from "@/components/shared/participants/with-popover";

type Props = {
  user: WorkspaceUserType;
};

export default function WorkingCard({ user }: Props) {
  return (
    <div className='flex flex-row gap-x-2 items-center'>
      <ParticipantsWithPopover className='!pb-0' participants={[user]} />
      <span className='text-sm capitalize'>{`${user.name} (${user.active_job?.total_hours})`}</span>
    </div>
  );
}
