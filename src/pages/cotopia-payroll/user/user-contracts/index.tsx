import { useApi } from "@/hooks/swr";
import { UserContractType } from "@/types/contract";
import UserContracts from "../../common/user-contracts";

export default function MyContracts() {
  const { data, isLoading } = useApi(`/users/me/contracts`);
  const items: UserContractType[] = data !== undefined ? data?.data : [];

  return (
    <UserContracts items={items} loading={isLoading || data === undefined} />
  );
}
