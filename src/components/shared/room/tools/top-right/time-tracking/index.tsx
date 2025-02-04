import useLoading from '@/hooks/use-loading';
import axiosInstance from '@/services/axios';
import { useEffect, useState } from 'react';
import { urlWithQueryParams } from '@/lib/utils';
import PopupBox from '@/components/shared/popup-box';
import TimeTrackingDetails from './details';
import TimeTrackingButton from './button';
import PopupBoxChild from '@/components/shared/popup-box/child';
import UserAvatar from '@/components/shared/user-avatar';
import { useRoomContext } from '@/components/shared/room/room-context';
import { useApi } from '@/hooks/swr';
import {
  CommitmentLeaderboardType,
  LeaderboardType,
} from '@/types/leaderboard';
import UserJobList from '@/components/shared/room/participant-detail/details/jobs/user-jobs';
import { UserType } from '@/types/user';
import CotopiaIconButton from '@/components/shared-ui/c-icon-button';
import { ArrowLeft } from 'lucide-react';
import useBus from 'use-bus';
import { __BUS } from '@/const/bus';

export default function TimeTrackingButtonTool() {
  const [seconds, setSeconds] = useState<undefined | number>();
  const [stop, setStop] = useState<boolean>(false);
  const [desc, setDesc] = useState<string | undefined>();

  const { startLoading, stopLoading, isLoading } = useLoading();
  const getActivityTime = () => {
    startLoading();
    axiosInstance
      .get(
        urlWithQueryParams(`/users/activities`, { period: 'today', new: true }),
      )
      .then((res) => {
        const mins = res.data.data.minutes;
        if (!res.data.data.time_count) {
          setStop(true);
          setDesc(res.data.data.time_stop_desc);
        }
        setSeconds(mins * 60);
        stopLoading();
      })
      .catch((err) => {
        stopLoading();
      });
  };
  useEffect(() => {
    getActivityTime();
  }, []);

  useBus(__BUS.stopWorkTimer, (evt) => {
    setStop(true);
  });

  useBus(__BUS.startWorkTimer, (evt) => {
    setStop(false);
  });

  const { workspace_id, workspaceUsers } = useRoomContext();

  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const { data: leaderboardData } = useApi(
    `/workspaces/${workspace_id}/commitmentLeaderboard`,
  );

  const leaderboard: CommitmentLeaderboardType[] = leaderboardData?.data ?? [];

  let header = <>Commitment Leaderboard</>;
  let content = (
    <TimeTrackingDetails
      leaderboard={leaderboard}
      workspaceUsers={workspaceUsers}
      setSelectedUser={setSelectedUser}
    />
  );

  if (selectedUser !== null) {
    content = <UserJobList userId={selectedUser.id} period={'this_month'} />;
    const userAvatar = workspaceUsers.find(
      (x) => x.id === selectedUser.id,
    )?.avatar;
    header = (
      <div className="flex flex-row items-center gap-x-2">
        <UserAvatar
          title={selectedUser.name}
          date={selectedUser?.created_at}
          src={userAvatar?.url}
        />
        <span className="text-xs">{selectedUser.name ?? '-'}</span>
      </div>
    );
  }

  return (
    <PopupBox
      trigger={(open, isOpen) => (
        <TimeTrackingButton
          isOpen={isOpen}
          defaultSeconds={seconds ?? 0}
          onClick={open}
          isLoading={isLoading}
          stop={stop}
          desc={desc}
        />
      )}
    >
      {(style, open, close) => {
        return (
          <PopupBoxChild
            {...style}
            left={style.left - (352 - style.width)}
            onClose={close}
            title={header}
            width={352}
            className="p-0 [&_.box-header]:p-4 overflow-hidden [&_.box-children]:w-full [&_.box-header]:pb-0"
            button={
              selectedUser && (
                <CotopiaIconButton
                  onClick={() => {
                    setSelectedUser(null);
                  }}
                  className="w-5 h-5 opacity-80 hover:opacity-100"
                >
                  <ArrowLeft className="text-grayscale-subtitle w-4 h-4" />
                </CotopiaIconButton>
              )
            }
          >
            {content}
          </PopupBoxChild>
        );
      }}
    </PopupBox>
  );
}
