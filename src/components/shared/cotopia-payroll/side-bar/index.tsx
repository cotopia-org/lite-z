import { PayrollSideBarType } from "@/types/payroll-sidebar";
import { NavLink } from "react-router-dom";
import PayrollSideBarHeader from "./header";
import Grid from "@/components/icons/grid";
import Profile from "@/components/icons/profile";
import MoneyRecive from "@/components/icons/money-recive";
import { WalletMinus } from "@/components/icons";
import Profile2User from "@/components/icons/profile-2-user";

const links = [
    { title: "User Profile", href: "/payroll", icon: <Profile /> },
    { title: "Employees", href: "/payroll-employees", icon: <Profile2User /> },
    { title: "Dashboard", href: "/payroll-dashboard", icon: <Grid /> },
    { title: "Payments", href: "/payroll-payments", icon: <MoneyRecive /> },
    { title: "Advance", href: "/payroll-advance", icon: <WalletMinus /> },
] as PayrollSideBarType[];

export default function PayrollSideBar() {
    return (
        <div className="min-w-80 max-w-80 min-h-screen bg-white">
            <PayrollSideBarHeader />

            <ul className="p-3 mt-4 flex flex-col gap-y-9">
                {links.map((link) => (
                    <li key={link.title}>
                        <NavLink
                            className={({ isActive }) =>
                                `p-3 rounded-md flex items-center gap-x-5 text-lg font-semibold transition-all duration-50 ease-in ${isActive ? 'bg-primary text-white border-l-4 border-black' : "hover:bg-primary hover:text-white hover:border-l-4 hover:border-black"}`
                            }
                            to={link.href}
                        >
                            {link.icon}
                            {link.title}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
}
