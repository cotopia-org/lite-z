import UserAvatar from "@/components/shared/user-avatar";
import { useAppSelector } from "@/store";

export default function PayrollUserAvatar() {
    const user = useAppSelector((store) => store.auth.user);

    return (
        <div className="flex flex-col items-center gap-y-3 w-full">
            <UserAvatar src={user?.avatar?.url} title={user?.username!} className="w-36 h-36" />
            <span className="font-semibold text-sm py-1 px-2 shadow-sm border border-border rounded-full">
                User {user?.status}</span>

            <div className="text-center">
                <h1 className="font-semibold">{user?.username}</h1>
                <p className="text-sm font-semibold text-gray-400">Front-End Developer</p>
            </div>


            <textarea className="w-full border border-border rounded-md p-3 font-medium" rows={4} value={user?.bio ? user.bio : "No user add pio yet"} disabled></textarea>
        </div>
    )
}