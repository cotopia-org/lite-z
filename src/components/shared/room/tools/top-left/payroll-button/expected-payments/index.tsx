import { useRoomContext } from "../../../../room-context";
import useAuth from "@/hooks/auth";
import { useApi } from "@/hooks/swr";
import { LeaderboardType } from "@/types/leaderboard";
import useUserContract from "@/hooks/contract";

export default function ExpectedPayments() {
    const { workspace_id } = useRoomContext();
    const { user } = useAuth();
    const { userContract } = useUserContract();
    const { data: leaderboardData } = useApi(
        `/workspaces/${workspace_id}/leaderboard`
    );
    const leaderboard: LeaderboardType[] = leaderboardData?.data ?? [];
    const currentUser = leaderboard.find((item) => item.user.id === user?.id);
    const workingTime = +((currentUser?.working_minutes! + currentUser?.idle_minutes!) / 60).toFixed(2);

    return (
        <>
            <div className="w-full my-4 flex items-center justify-between px-2">
                <h3 className="text-lg font-semibold">Expected Payment</h3>
                <span className="font-semibold text-black">
                    {currentUser && userContract ? (
                        <>
                            <span className="text-base font-bold">{+(workingTime * userContract?.amount).toFixed(2)}</span>
                            <span className="text-gray-400 font-medium text-sm"> USDT</span>
                        </>
                    ) : (<span className="text-sm font-medium">User no have contract yet</span>)}
                </span>
            </div>
            <hr />
        </>
    )
}