import { Coins, Grid, HandCoins, User, UserRoundPen, X } from "lucide-react";
import CotopiaButton from "@/components/shared-ui/c-button";
import { PayrollPage, usePayroll } from "@/pages/cotopia-payroll/user/payroll";
import { ReactNode, useState } from "react";
import { cn, isUserAdmin } from "@/lib/utils";
import useAuth from "@/hooks/auth";
import { useRoomContext } from "@/components/shared/room/room-context";
import Jobs from "@/pages/dashboard/jobs";

type Props = {
  onClose?: () => void;
  links: {
    title: string;
    page: string;
    icon: ReactNode;
    content: ReactNode;
  }[];
  handleChange: (page: string) => void;
  page?: string;
};
export default function Sidebar({ onClose, links, handleChange, page }: Props) {
  return (
    <ul className="p-3 mt-4 flex flex-col gap-y-2">
      {links.map((link, index) => (
        <li key={index}>
          <CotopiaButton
            startIcon={link.icon}
            onClick={() => handleChange(link.page)}
            className={cn(
              "w-full justify-start text-lg",
              link.page === page ? "bg-primary text-white" : "hover:bg-black/5",
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
