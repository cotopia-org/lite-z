import { useAppSelector } from "@/store";
import UserAvatar from "@/components/shared/user-avatar";
import { FullModalBox } from "@/components/shared/modal-box";
import PayrollUserSettings from "../../user-information/settings";

export default function PayrollSideBarHeader() {
    const user = useAppSelector((store) => store.auth.user);

    return (
        <FullModalBox
            trigger={(open) => (
                <div onClick={open} className="w-full p-3 flex items-center justify-between border-b border-border">
                    <div className="flex items-center gap-x-2">
                        <UserAvatar src={user?.avatar?.url} title={user?.username!} className="w-10 h-10" />
                        <h1 className="text-base font-semibold">{user?.username}</h1>
                    </div>

                    {user?.id === 6 || user?.id === 3 ? (<p className="text-sm font-semibold text-gray-600">Admin</p>) : (<p className="text-sm font-semibold text-gray-600">User</p>)}
                </div>
            )}
            className='w-[640px]'
        >
            {(open, close) => <PayrollUserSettings />}
        </FullModalBox>
    )
}