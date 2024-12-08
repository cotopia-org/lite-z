import { useRoomContext } from "../../../../room-context";
import useAuth from "@/hooks/auth";
import { useApi } from "@/hooks/swr";
import { LeaderboardType } from "@/types/leaderboard";
import useUserContract from "@/hooks/use-user-contract";
import { useEffect, useState } from "react";

export default function ExpectedPayments() {
  const { workspace_id } = useRoomContext();
  const { user } = useAuth();
  const { userContract } = useUserContract();
  const { data: leaderboardData } = useApi(
    `/workspaces/${workspace_id}/leaderboard`
  );

  const leaderboard: LeaderboardType[] = leaderboardData?.data ?? [];
  const currentUser = leaderboard.find((item) => item.user.id === user?.id);
  const workingTime = +(
    (currentUser?.working_minutes! + currentUser?.idle_minutes!) /
    60
  ).toFixed(2);

  const [expectedPayment, setExpectedPayment] = useState<number>(0);

  useEffect(() => {
    if (currentUser && userContract) {
      setExpectedPayment(+(workingTime * userContract?.amount).toFixed(2));

      const interval = setInterval(() => {
        setExpectedPayment(+(workingTime * userContract?.amount).toFixed(2));
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [currentUser, userContract, workingTime]);

  return (
    <span className='font-semibold text-black'>
      {currentUser && userContract ? (
        <>
          <span className='text-base font-bold'>{expectedPayment}</span>
          <span className='text-gray-400 font-medium text-sm'> USDT</span>
        </>
      ) : (
        <span className='text-sm font-medium'>No have contract yet</span>
      )}
    </span>
  );
}
