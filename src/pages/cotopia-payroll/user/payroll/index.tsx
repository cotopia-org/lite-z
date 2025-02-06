import PayrollWrapper from '../../payroll-wrapper';
import { createContext, useContext, useState } from 'react';
import PayrollDashboard from '../../common/users-payments';
import PayrollPayments from '../../user/payments';
import PayrollCreateContract from '../../admin/create-contract';
import PayrollCreatePayments from '../../admin/create-payments';
import Employees from '../../admin/employees/components/employees-table';
import PayrollAllPayments from '../../admin/all-payments';
import AllUserContracts from '../../admin/all-user-contracts';
import MyContracts from '../user-contracts';
import CotopiaWallet from '../../common/cotopia-wallet';

type Props = {
  onClose: () => void;
};

export type PayrollPageType =
  | 'all-members'
  | 'all-user-contract'
  | 'user-contract'
  | 'cotopia-wallet'
  | 'payments'
  | 'all-payments'
  | 'create-contract'
  | 'create-payments';

const PayrollContext = createContext<{
  onClose: () => void;
  page: PayrollPageType;
  changePage: (page: PayrollPageType) => void;
}>({
  onClose: () => {},
  page: 'user-contract',
  changePage: (page) => {},
});

export const usePayroll = () => useContext(PayrollContext);

export default function PayrollPage({ onClose }: Props) {
  const [active, setActive] = useState<PayrollPageType>('user-contract');
  let content = null;
  switch (active) {
    case 'all-user-contract':
      content = <AllUserContracts />;
      break;
    case 'user-contract':
      content = <MyContracts />;
      break;
    case 'create-contract':
      content = <PayrollCreateContract />;
      break;
    case 'create-payments':
      content = <PayrollCreatePayments />;
      break;
    case 'all-members':
      content = <Employees />;
      break;
    case 'cotopia-wallet':
      content = <CotopiaWallet />;
      break;
    case 'all-payments':
      content = <PayrollAllPayments />;
      break;
    case 'payments':
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
