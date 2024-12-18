import { useApi } from "@/hooks/swr";
import { UserContractType } from "@/types/contract";
import UserContracts from "../../common/user-contracts";

export default function AllUserContracts() {
  const { data, isLoading } = useApi(`/contracts`);
  const items: UserContractType[] = data !== undefined ? data?.data : [];

  return (
    <UserContracts items={items} loading={isLoading || data === undefined} />
  );
}
