import Grid from "@/components/icons/grid";
import UserAvatar from "@/components/shared/user-avatar";
import { useAppSelector } from "@/store";

export default function PayrollPage() {
    const user = useAppSelector((store) => store.auth.user);

    return (
        <main className="flex bg-slate-50">


            <div className="w-80 min-h-screen bg-white">

                <div className="w-full p-3 shadow-md flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Cotopia<span className="text-blue-500">Payroll.</span></h1>
                    <UserAvatar src={user?.avatar?.url} title={user?.username!}/>
                </div>

                <ul className="p-8">
                    <li className=""><Grid /> Dashboard</li>
                </ul>
                
            </div>


        </main>
    )
}