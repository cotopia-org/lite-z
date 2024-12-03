import { NavLink } from "react-router-dom";
import { PayrollSideBarType } from "@/types/payroll-sidebar";
import { useAppSelector } from "@/store";
import { Coins, Grid, User, Wallet, X } from "lucide-react";
import CotopiaButton from "@/components/shared-ui/c-button";
import { PayrollPage, usePayroll } from "@/pages/cotopia-payroll/payroll";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function PayrollSideBarLink() {
  const { onClose, changePage, page } = usePayroll();

  const user = useAppSelector((store) => store.auth.user);

  const links: {
    title: string;
    page: PayrollPage;
    icon: ReactNode;
    visible?: boolean;
  }[] = [
    { title: "User Profile", page: "user-profile", icon: <User /> },
    {
      title: "Employees",
      page: "employees",
      icon: <User />,
      visible: user?.id === 6,
    },
    { title: "Dashboard", page: "dashboard", icon: <Grid /> },
    { title: "Payments", page: "payments", icon: <Coins /> },
    { title: "Advance", page: "advance", icon: <Wallet /> },
  ];

  return (
    <ul className='p-3 mt-4 flex flex-col gap-y-2'>
      {links
        .filter((link) => link.visible !== false)
        .map((link) => (
          <li key={link.title}>
            <CotopiaButton
              startIcon={link.icon}
              onClick={() => changePage(link.page)}
              className={cn(
                "w-full justify-start text-lg",
                link.page === page
                  ? "bg-primary text-white"
                  : "hover:bg-black/5"
              )}
              variant={"ghost"}
            >
              {link.title}
            </CotopiaButton>
          </li>
        ))}
      <li>
        <CotopiaButton
          startIcon={<X />}
          onClick={onClose}
          className='w-full justify-start text-lg hover:bg-primary hover:text-white'
          variant={"ghost"}
        >
          Close
        </CotopiaButton>
      </li>
    </ul>
  );
}
