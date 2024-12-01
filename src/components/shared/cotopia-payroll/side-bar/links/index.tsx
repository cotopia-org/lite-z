import { NavLink } from "react-router-dom";
import { PayrollSideBarType } from "@/types/payroll-sidebar";
import Grid from "@/components/icons/grid";
import Profile from "@/components/icons/profile";
import MoneyRecive from "@/components/icons/money-recive";
import { WalletMinus } from "@/components/icons";
import Profile2User from "@/components/icons/profile-2-user";
import { useAppSelector } from "@/store";


export default function PayrollSideBarLink() {
    const user = useAppSelector((store) => store.auth.user);

    const links = [
        { title: "User Profile", href: "/payroll", icon: <Profile /> },
        { title: "Employees", href: "/payroll-employees", icon: <Profile2User />, visible: user?.id === 6 },
        { title: "Dashboard", href: "/payroll-dashboard", icon: <Grid /> },
        { title: "Payments", href: "/payroll-payments", icon: <MoneyRecive /> },
        { title: "Advance", href: "/payroll-advance", icon: <WalletMinus /> },
    ] as (PayrollSideBarType & { visible?: boolean })[];

    return (
        <ul className="p-3 mt-4 flex flex-col gap-y-9">
            {links.filter(link => link.visible !== false).map((link) => (
                <li key={link.title}>
                    <NavLink
                        className={({ isActive }) =>
                            `p-3 rounded-md flex items-center gap-x-5 text-lg font-semibold transition-all duration-50 ease-in 
                  [&_svg_path]:stroke-black 
                   ${isActive ? '[&_svg_path]:stroke-white bg-primary text-white border-l-4 border-black' : 'hover:bg-primary hover:text-white [&_svg_path]:hover:stroke-white'}`
                        }
                        to={link.href}
                    >
                        {link.icon}
                        {link.title}
                    </NavLink>
                </li>
            ))}
        </ul>

    )
}