import { useAppSelector } from "@/store";
import UserAvatar from "@/components/shared/user-avatar";

export default function PayrollSideBarHeader() {
    const user = useAppSelector((store) => store.auth.user);

    return (
        <div className="w-full p-3 shadow-md flex items-center justify-between">
            <h1 className="text-xl font-semibold">Cotopia<span className="text-primary">Payroll.</span></h1>
            <UserAvatar src={user?.avatar?.url} title={user?.username!} />
        </div>
    )
}