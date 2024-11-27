import ParticipantsWithPopover from "@/components/shared/participants/with-popover";
import { WorkspaceUserType } from "@/types/user";

type Props = {
  user: WorkspaceUserType;
};
export default function User({ user }: Props) {
  return (
    <div className='flex flex-row items-center gap-x-2'>
      <ParticipantsWithPopover className='!pb-0' participants={[user]} />
      <span>{user.name}</span>
    </div>
  );
}
