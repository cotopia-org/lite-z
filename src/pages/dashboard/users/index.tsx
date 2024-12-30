import CotopiaButton from '@/components/shared-ui/c-button';
import CotopiaTable from '@/components/shared-ui/c-table';
import ParticipantsWithPopover from '@/components/shared/participants/with-popover';
import { useRoomContext } from '@/components/shared/room/room-context';
import { useMemo, useState } from 'react';
import { UserType } from '@/types/user';
import User from '@/pages/dashboard/users/single';
import CotopiaAvatar from '@/components/shared-ui/c-avatar';
import moment from 'moment';

export default function Users() {
  const [selectedUser, setSelectedUser] = useState<UserType>();

  const { workspaceUsers, workspace_id } = useRoomContext();

  const tableHeadItems = useMemo(() => {
    return [
      {
        title: '#',
        render: (item: UserType) => {
          return item.id;
        },
      },
      {
        title: 'User',
        render: (user: UserType) => {
          return (
            <div
              onClick={() => setSelectedUser(user)}
              className={
                'flex gap-2 items-center w-auto cursor-pointer  rounded p-1'
              }
            >
              <CotopiaAvatar
                date={user.created_at}
                className={`min-w-12 min-h-12`}
                src={user.avatar?.url}
                title={user.username[0]}
                status={
                  <div
                    className={
                      'w-full h-full rounded-full p-1 ' +
                      (user.status === 'online'
                        ? 'bg-green-500'
                        : 'bg-gray-500')
                    }
                  ></div>
                }
              />
              <div className={'flex flex-col font-bold text-blue-500'}>
                {user.username}
              </div>
            </div>
          );
        },
      },

      {
        title: 'Name',
        render: (user: UserType) => {
          return user.name;
        },
      },
      {
        title: 'Email',
        render: (user: UserType) => {
          return user.email;
        },
      },
      {
        title: 'Last login',
        render: (user: UserType) => {
          return user.status === 'online'
            ? 'Online'
            : moment(user.last_login).fromNow();
        },
      },
      {
        title: 'Created at',
        render: (user: UserType) => {
          return moment.unix(user.created_at).format('DD/MM/YYYY HH:MM:SS');
        },
      },
    ];
  }, []);

  if (selectedUser)
    return (
      <User
        onBack={() => {
          setSelectedUser(undefined);
        }}
        user={selectedUser}
      />
    );

  return (
    <div className={'p-4'}>
      <div className="flex flex-row items-center gap-x-4 justify-between"></div>

      <CotopiaTable items={workspaceUsers} tableHeadItems={tableHeadItems} />
    </div>
  );
}
