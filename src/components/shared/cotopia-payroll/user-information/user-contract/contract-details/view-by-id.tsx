import { useApi } from "@/hooks/use-api";
import PayrollContractDetails from ".";

type Props = {
  contract_id: number;
  onBack: () => void;
};
export default function ContractDetailsById({ contract_id, onBack }: Props) {
  const { data, isLoading } = useApi(`/contracts/${contract_id}`);
  const contract = data !== undefined ? data?.data : null;

  return (
    <PayrollContractDetails
      contract={contract}
      onBack={onBack}
      isLoading={isLoading}
    />
  );
}
