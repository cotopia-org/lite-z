
import { PayrollSideBarType } from "@/types/payroll-sidebar";
import { Bug, DollarSign, Grid, MessageCircleMore, User, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import PayrollSideBarHeader from "./header";

const links = [
    { title: "User Profile", href: "/payroll", icon: <User /> },
    { title: "Dashboard", href: "/payroll/dashboard", icon: <Grid /> },
    { title: "Payments", href: "/payroll/payments", icon: <DollarSign /> },
    { title: "Advance", href: "/payroll/advance", icon: <Wallet /> },
    { title: "Messages", href: "/payroll/messages", icon: <MessageCircleMore /> },
    { title: "Report", href: "/payroll/report", icon: <Bug /> }
] as PayrollSideBarType[];

export default function PayrollSideBar() {
    return (
        <div className="w-80 min-h-screen bg-white">
            <PayrollSideBarHeader />

            <ul className="p-3 mt-4 flex flex-col gap-y-9 ">
                {links.map((link) => (
                    <li key={link.title} className="text-lg font-semibold transition-all duration-50 ease-in hover:bg-primary hover:text-white hover:border-l-4 hover:border-black p-2 rounded-md"><Link className="flex items-center gap-x-5" to={link.href}>{link.icon}{link.title}</Link></li>
                ))}
            </ul>
        </div>
    )
}