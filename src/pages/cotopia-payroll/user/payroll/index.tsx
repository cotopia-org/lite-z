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
import { useParams } from 'react-router-dom';
import { useApi } from '@/hooks/swr';
import { FetchDataType } from '@/services/axios';
import { UserType, WorkspaceUserType } from '@/types/user';

type Props = {
  onClose: () => void;
};

export type PayrollPageType =
  | 'all-members'
  | 'all-user-contract'
  | 'user-contract'
  | 'all-payment'
  | 'payments'
  | 'all-payments'
  | 'create-contract'
  | 'create-payments';

const PayrollContext = createContext<{
  onClose: () => void;
  page: PayrollPageType;
  changePage: (page: PayrollPageType) => void;
  users: WorkspaceUserType[];
}>({
  onClose: () => {},
  page: 'user-contract',
  changePage: (page) => {},
  users: [],
});

export const usePayroll = () => useContext(PayrollContext);

export default function PayrollPage({ onClose }: Props) {
  const { workspace_id } = useParams();
  const { data } = useApi<FetchDataType<WorkspaceUserType[]>>(
    `/workspaces/${workspace_id}/users`,
  );
  const users = data !== undefined ? data.data : [];

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
    case 'all-payment':
      content = <PayrollDashboard />;
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
      value={{ onClose, page: active, changePage: setActive, users }}
    >
      <PayrollWrapper>{content}</PayrollWrapper>
    </PayrollContext.Provider>
  );
}
