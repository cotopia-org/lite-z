import { useApi } from '@/hooks/swr';
import { UserContractType } from '@/types/contract';
import UserContracts from '../../common/user-contracts';

export default function AllUserContracts() {
  const { data, isLoading, mutate } = useApi(`/contracts`);
  const items: UserContractType[] = data !== undefined ? data?.data : [];

  return (
    <UserContracts
      items={items}
      mutate={mutate}
      loading={isLoading || data === undefined}
    />
  );
}
