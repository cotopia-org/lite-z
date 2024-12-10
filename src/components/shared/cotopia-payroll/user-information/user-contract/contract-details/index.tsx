import { UserContractType } from "@/types/contract";
import PayrollSectionTitle from "../sections-title";
import CotopiaButton from "@/components/shared-ui/c-button";
import { ChevronLeft } from "lucide-react";
import SignContract from "./sign";
import { useEffect, useState } from "react";
import HintAddressContract from "@/components/shared/room/tools/top-right/payroll-button/hint-address-contract";
import Markdown from "markdown-to-jsx";
import TitleEl from "@/components/shared/title-el";

type Props = {
  contract: UserContractType;
  isLoading?: boolean;
  onBack: () => void;
  onUpdate?: (contract: UserContractType) => void;
};

export default function PayrollContractDetails({
  contract,
  isLoading = false,
  onBack,
  onUpdate,
}: Props) {
  const [localContract, setLocalContract] = useState(contract);
  useEffect(() => {
    setLocalContract(contract);
  }, [contract]);

  console.log("localContract", localContract);

  // function formattedDate(contractDate: string) {
  //   const date = new Date(contractDate);
  //   return `${date.getFullYear()}-${(date.getMonth() + 1)
  //     .toString()
  //     .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  // }

  // const contractDetails = [
  //   { key: "Contract Type", value: localContract?.type },
  //   { key: "Currency", value: localContract?.currency },
  //   { key: "Start at", value: formattedDate(localContract?.start_at!) },
  //   { key: "End at", value: formattedDate(localContract?.end_at!) },
  //   { key: "Created at", value: formattedDate(localContract?.created_at!) },
  //   { key: "Updated at", value: formattedDate(localContract?.updated_at!) },
  //   { key: "Min hours", value: localContract?.min_hours },
  //   { key: "Max hours", value: localContract?.max_hours },
  //   { key: "User role", value: localContract?.role },
  //   { key: "Amount", value: localContract?.amount },
  //   { key: "Contractor Status", value: localContract?.contractor_status },
  //   { key: "Auto Renewal", value: localContract?.auto_renewal ? "yes" : "no" },
  //   { key: "Payment method", value: localContract?.payment_method },
  //   { key: "Contract id", value: localContract?.id },
  //   { key: "Payment address", value: localContract?.payment_address },
  // ];

  return (
    <div className='flex flex-col gap-y-4'>
      <PayrollSectionTitle title='User Contract' />
      {isLoading ? (
        <p className='text-gray-400 text-xl font-semibold text-center'>
          Loading contract details...
        </p>
      ) : contract ? (
        <>
          <Markdown className='[&_h1]:text-xl [&_h1]:mb-4 [&_h1]:font-bold [&_ol]:ml-4 [&_li]:mb-4 [&_li]:list-decimal'>{`${
            contract.text ?? ""
          }`}</Markdown>
          {/* <ul className='grid grid-cols-12 gap-4 w-full'> */}
          {/* {contractDetails.map((contractDetail, index) => (
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
          ))} */}
          {/* </ul> */}
        </>
      ) : (
        <p className='text-gray-400 text-xl font-semibold text-center'>
          You don't have any contract yet.
        </p>
      )}
      {!!localContract.payment_address && (
        <TitleEl title='Payment address'>
          {localContract.payment_address}
        </TitleEl>
      )}
      <HintAddressContract
        contract={localContract}
        onUpdate={(contract) => {
          if (onUpdate) onUpdate(contract);
          setLocalContract(contract);
        }}
      />
      <SignContract contract={localContract} onUpdate={setLocalContract} />
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
