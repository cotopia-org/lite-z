import CotopiaAvatar from '../shared-ui/c-avatar';
import { UserMinimalType, UserType, WorkspaceUserType } from '@/types/user';
import CotopiaPopover from '@/components/shared-ui/c-popover';
import Details from '@/components/shared/room/participant-detail/details';

type Props = {
  user: UserType | UserMinimalType | WorkspaceUserType;
};

export default function UserView({ user }: Props) {
  return (
    <CotopiaPopover
      trigger={
        <div className={'flex gap-2 items-center'}>
          <CotopiaAvatar
            date={user.created_at}
            className={`min-w-8 min-h-8 w-8 h-8`}
            src={user.avatar?.url}
            title={user.username ? user.username?.[0] : undefined}
          />
          <div className={'flex flex-col'}>{user.username}</div>
        </div>
      }
      contentClassName="p-0 overflow-hidden border-0 m-0 shadow-md"
    >
      {() => {
        return <Details user={user as UserMinimalType} />;
      }}
    </CotopiaPopover>
  );
}
