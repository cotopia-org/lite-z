import { useAppSelector } from "@/store";
import UserAvatar from "@/components/shared/user-avatar";
import { FullModalBox } from "@/components/shared/modal-box";
import PayrollUserSettings from "../../user-information/settings";

export default function PayrollSideBarHeader() {
    const user = useAppSelector((store) => store.auth.user);

    return (
        <FullModalBox
            trigger={(open) => (
                <div onClick={open} className="w-full p-3 flex items-center gap-x-2 border-b border-border">
                    <UserAvatar src={user?.avatar?.url} title={user?.username!} className="w-10 h-10" />
                    <h1 className="text-base font-semibold">{user?.username}</h1>
                </div>
            )}
            className='w-[640px]'
        >
            {(open, close) => <PayrollUserSettings />}
        </FullModalBox>
    )
}