import UserContracts from '../../common/user-contracts';
import { useContractsCtx } from '@/components/shared/room/tools/top-right/payroll-button';

export default function AllUserContracts() {
  const { contracts: items, loading } = useContractsCtx();

  return <UserContracts items={items} loading={loading} />;
}
