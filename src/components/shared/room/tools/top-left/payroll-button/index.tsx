import CotopiaButton from "@/components/shared-ui/c-button";
import PopupBox from "@/components/shared/popup-box";
import PopupBoxChild from "@/components/shared/popup-box/child";
import { Wallet } from "lucide-react";
import ToolButton from "../../tool-button";
import { useRoomContext } from "../../../room-context";
import useAuth from "@/hooks/auth";
import { useApi } from "@/hooks/swr";
import { LeaderboardType } from "@/types/leaderboard";
import useUserContract from "@/hooks/contract";

export default function PayrollButton() {
    const currentURL = typeof window !== "undefined" ? window.location.href : "";
    const url = currentURL ? new URL(currentURL).origin : "";
    const { workspace_id } = useRoomContext();
    const { user } = useAuth();
    const { userContract } = useUserContract();
    const { data: leaderboardData } = useApi(
        `/workspaces/${workspace_id}/leaderboard`
    );

    const leaderboard: LeaderboardType[] = leaderboardData?.data ?? [];

    const currentUser = leaderboard.find((item) => item.user.id === user?.id);

    return (
        <PopupBox
            trigger={(open, isOpen) => (
                <ToolButton
                    open={open}
                    onClick={open}
                    startIcon={<Wallet size={20} />}
                    isOpen={isOpen}
                >
                    Payroll
                </ToolButton>
            )}
        >
            {(triggerPosition, open, close) => (
                <PopupBoxChild
                    onClose={close}
                    title="Cotopia Payroll"
                    width={400}
                    zIndex={triggerPosition.zIndex}
                    top={triggerPosition.top}
                    left={triggerPosition.left}
                >
                    <div className="my-4 flex items-center justify-between px-2">
                        <h3 className="text-lg font-semibold">Previous Payment</h3>
                        <span className="font-semibold text-black">
                            220
                            <span className="text-gray-400 font-medium text-sm">USDT</span>
                        </span>
                    </div>
                    <hr />

                    <div className="my-4 flex items-center justify-between px-2">
                        <h3 className="text-lg font-semibold">Expected Payment</h3>
                        <span className="font-semibold text-black">
                            {currentUser && userContract ? (
                                <>
                                    <span>{+(currentUser.working_minutes / 60).toFixed(2) * userContract?.amount}</span>
                                    <span className="text-gray-400 font-medium text-sm">USDT</span>
                                </>
                            ) : (<span className="text-sm font-medium">User no have contract yet</span>)}
                        </span>
                    </div>

                    <hr />
                    <CotopiaButton
                        className="bg-black text-white rounded-xl mt-3"
                    >

                        <a href={`${url}/payroll`} target="_blank" rel="noopener noreferrer">
                            More
                        </a>

                    </CotopiaButton>
                </PopupBoxChild>
            )}
        </PopupBox>
    );
}