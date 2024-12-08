import { UserContractType } from "@/types/contract";
import PayrollSectionTitle from "../sections-title";
import CotopiaButton from "@/components/shared-ui/c-button";
import { ChevronLeft } from "lucide-react";

type Props = {
  contract: UserContractType;
  isLoading?: boolean;
  onBack: () => void;
};

export default function PayrollContractDetails({
  contract,
  isLoading = false,
  onBack,
}: Props) {
  function formattedDate(contractDate: string) {
    const date = new Date(contractDate);
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  }

  const contractDetails = [
    { key: "Contract Type", value: contract?.type },
    { key: "Currency", value: contract?.currency },
    { key: "Start at", value: formattedDate(contract?.start_at!) },
    { key: "End at", value: formattedDate(contract?.end_at!) },
    { key: "Created at", value: formattedDate(contract?.created_at!) },
    { key: "Updated at", value: formattedDate(contract?.updated_at!) },
    { key: "Min hours", value: contract?.min_hours },
    { key: "Max hours", value: contract?.max_hours },
    { key: "User role", value: contract?.role },
    { key: "Amount", value: contract?.amount },
    { key: "Contractor Status", value: contract?.contractor_status },
    { key: "Auto Renewal", value: contract?.auto_renewal ? "yes" : "no" },
    { key: "Payment method", value: contract?.payment_method },
    { key: "Contract id", value: contract?.id },
    { key: "Payment address", value: contract?.payment_address },
  ];

  return (
    <div className='flex flex-col gap-y-4'>
      <PayrollSectionTitle title='User Contract' />
      {isLoading ? (
        <p className='text-gray-400 text-xl font-semibold text-center'>
          Loading contract details...
        </p>
      ) : contract ? (
        <ul className='grid grid-cols-12 gap-4 w-full'>
          {contractDetails.map((contractDetail, index) => (
            <li
              key={contractDetail.key}
              className={`w-full text-base shadow-md p-3 rounded-md border border-border font-semibold flex items-center justify-between bg-gray-50 ${
                index === contractDetails.length - 1
                  ? "col-span-12"
                  : "col-span-6"
              }`}
            >
              {contractDetail.key}
              <span className='text-sm font-medium'>
                {contractDetail.value}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className='text-gray-400 text-xl font-semibold text-center'>
          You don't have any contract yet.
        </p>
      )}
      <CotopiaButton
        variant={"link"}
        startIcon={<ChevronLeft />}
        onClick={onBack}
      >
        Close Contract
      </CotopiaButton>
    </div>
  );
}
