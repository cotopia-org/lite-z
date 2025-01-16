import UserContracts from '../../common/user-contracts';
import { useContractsCtx } from '../../payroll-wrapper';

export default function MyContracts() {
  const { myContracts: items, loading } = useContractsCtx();

  return <UserContracts items={items} loading={loading} />;
}
