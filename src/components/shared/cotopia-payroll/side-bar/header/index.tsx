import { useAppSelector } from "@/store";
import UserAvatar from "@/components/shared/user-avatar";

export default function PayrollSideBarHeader() {
    const user = useAppSelector((store) => store.auth.user);

    return (
        <div className="w-full p-3 flex items-center gap-x-2 border-b border-border">
            <UserAvatar src={user?.avatar?.url} title={user?.username!} />
            <h1 className="text-base font-semibold">{user?.username}</h1>
        </div>
    )
}