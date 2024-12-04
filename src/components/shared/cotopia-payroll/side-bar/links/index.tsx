import { Coins, Grid, User, X } from "lucide-react";
import CotopiaButton from "@/components/shared-ui/c-button";
import { PayrollPage, usePayroll } from "@/pages/cotopia-payroll/user/payroll";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks/auth";

export default function PayrollSideBarLink() {
  const { onClose, changePage, page } = usePayroll();
  const { user } = useAuth();

  const links: {
    title: string;
    page: PayrollPage;
    icon: ReactNode;
  }[] =
    user?.id === 6
      ? [
        {
          title: "Members",
          page: "all-members",
          icon: <User />,
        },
        {
          title: "Users Payments",
          page: "all-payment",
          icon: <Grid />,
        },
        {
          title: "Create Contract",
          page: "create-contract",
          icon: <Grid />,
        },
        {
          title: "Create Payments",
          page: "create-payments",
          icon: <User />,
        },
      ]

      : [
        {
          title: "User contract",
          page: "user-contract",
          icon: <User />,
        },
        {
          title: "Users Payments",
          page: "all-payment",
          icon: <Grid />,
        },
        {
          title: "Payments",
          page: "payments",
          icon: <Coins />,
        },
      ];

  return (
    <ul className="p-3 mt-4 flex flex-col gap-y-8">
      {links.map((link) => (
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
          className="w-full justify-start text-lg hover:bg-primary hover:text-white"
          variant={"ghost"}
        >
          Close
        </CotopiaButton>
      </li>
    </ul>
  );
}

