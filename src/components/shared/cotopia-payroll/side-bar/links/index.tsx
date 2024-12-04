import { Coins, Grid, User, Wallet, X } from "lucide-react";
import CotopiaButton from "@/components/shared-ui/c-button";
import { PayrollPage, usePayroll } from "@/pages/cotopia-payroll/payroll";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function PayrollSideBarLink() {
  const { onClose, changePage, page } = usePayroll();

  const links: {
    title: string;
    page: PayrollPage;
    icon: ReactNode;
  }[] = [
    { title: "User Profile", page: "user-profile", icon: <User /> },
    {
      title: "User contract",
      page: "user-contract",
      icon: <User />,
    },
    { title: "All Payments", page: "all-payment", icon: <Grid /> },
    { title: "Payments", page: "payments", icon: <Coins /> },
    { title: "Advance", page: "advance", icon: <Wallet /> },
  ];

  return (
    <ul className='p-3 mt-4 flex flex-col gap-y-8'>
      {links
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
