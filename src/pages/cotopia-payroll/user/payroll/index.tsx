import PayrollWrapper from "../../payroll-wrapper";
import { createContext, useContext, useState } from "react";
import PayrollDashboard from "../../common/users-payments";
import PayrollPayments from "../../user/payments";
import PayrollCreateContract from "../../admin/create-contract";
import PayrollCreatePayments from "../../admin/create-payments";
import Employees from "../../admin/employees/components/employees-table";
import PayrollAllPayments from "../../admin/all-payments";
import AllUserContracts from "../../admin/all-user-contracts";
import MyContracts from "../user-contracts";

type Props = {
  onClose: () => void;
};

export type PayrollPage =
  | "all-members"
  | "all-user-contract"
  | "user-contract"
  | "all-payment"
  | "payments"
  | "all-payments"
  | "create-contract"
  | "create-payments";

const PayrollContejxt = createContext<{
  onClose: () => void;
  page: PayrollPage;
  changePage: (page: PayrollPage) => void;
}>({
  onClose: () => {},
  page: "user-contract",
  changePage: (page) => {},
});

export const usePayroll = () => useContext(PayrollContejxt);

export default function PayrollPage({ onClose }: Props) {
  const [active, setActive] = useState<PayrollPage>("user-contract");
  let content = null;
  switch (active) {
    case "all-user-contract":
      content = <AllUserContracts />;
      break;
    case "user-contract":
      content = <MyContracts />;
      break;
    case "create-contract":
      content = <PayrollCreateContract />;
      break;
    case "create-payments":
      content = <PayrollCreatePayments />;
      break;
    case "all-members":
      content = <Employees />;
      break;
    case "all-payment":
      content = <PayrollDashboard />;
      break;
    case "all-payments":
      content = <PayrollAllPayments />;
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
