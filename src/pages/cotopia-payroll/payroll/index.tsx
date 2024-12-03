import PayrollPersonalProfile from "@/components/shared/cotopia-payroll/user-information/personal-profile";
import PayrollWrapper from "../payroll-wrapper";
import PayrollUserContract from "@/components/shared/cotopia-payroll/user-information/user-contract";
import { createContext, SetStateAction, useContext, useState } from "react";
import PayrollAdvance from "../advance";
import PayrollDashboard from "../dashboard";
import PayrollEmployees from "../employees";
import PayrollPayments from "../payments";

type Props = {
  onClose: () => void;
};

export type PayrollPage =
  | "user-profile"
  | "dashboard"
  | "employees"
  | "payments"
  | "advance";

const PayrollContext = createContext<{
  onClose: () => void;
  page: PayrollPage;
  changePage: (page: PayrollPage) => void;
}>({
  onClose: () => {},
  page: "user-profile",
  changePage: (page) => {},
});

export const usePayroll = () => useContext(PayrollContext);

export default function PayrollPage({ onClose }: Props) {
  const [active, setActive] = useState<PayrollPage>("user-profile");
  let content = null;
  switch (active) {
    case "user-profile":
      content = (
        <div className='flex gap-3 flex-1 p-3'>
          <PayrollPersonalProfile />
          <PayrollUserContract />
        </div>
      );
      break;
    case "advance":
      content = <PayrollAdvance />;
      break;
    case "dashboard":
      content = <PayrollDashboard />;
      break;
    case "employees":
      content = <PayrollEmployees />;
      break;
    case "payments":
      content = <PayrollPayments />;
      break;
  }

  return (
    <PayrollContext.Provider
      value={{ onClose, page: active, changePage: setActive }}
    >
      <PayrollWrapper>{content}</PayrollWrapper>
    </PayrollContext.Provider>
  );
}
