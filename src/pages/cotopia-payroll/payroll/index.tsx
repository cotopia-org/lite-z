import PayrollWrapper from "../payroll-wrapper";
import PayrollUserContract from "@/components/shared/cotopia-payroll/user-information/user-contract";
import { createContext, useContext, useState } from "react";
import PayrollDashboard from "../dashboard";
import PayrollPayments from "../payments";

type Props = {
  onClose: () => void;
};

export type PayrollPage =
  | "user-contract"
  | "all-payment"
  | "payments"

const PayrollContejxt = createContext<{
  onClose: () => void;
  page: PayrollPage;
  changePage: (page: PayrollPage) => void;
}>({
  onClose: () => { },
  page: "user-contract",
  changePage: (page) => { },
});

export const usePayroll = () => useContext(PayrollContejxt);

export default function PayrollPage({ onClose }: Props) {
  const [active, setActive] = useState<PayrollPage>("user-contract");
  let content = null;
  switch (active) {
    case "user-contract":
      content = <PayrollUserContract />;
      break;
    case "all-payment":
      content = <PayrollDashboard />;
      break;
    case "payments":
      content = <PayrollPayments />;
      break;

  }

  return (
    <PayrollContejxt.Provider
      value={{ onClose, page: active, changePage: setActive }}
    >
      <PayrollWrapper>{content}</PayrollWrapper>
    </PayrollContejxt.Provider>
  );
}
