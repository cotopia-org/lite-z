import CotopiaButton from "@/components/shared-ui/c-button";
import CDialog from "@/components/shared-ui/c-dialog";
import PayrollContractDetails from "@/components/shared/cotopia-payroll/user-information/user-contract/contract-details";
import { UserContractType } from "@/types/contract";
import { MoveRightIcon } from "lucide-react";

type Props = {
  contract: UserContractType;
};

export default function ContractDetails({ contract }: Props) {
  return (
    <CDialog
      trigger={(open) => (
        <CotopiaButton
          onClick={open}
          variant={"link"}
          endIcon={<MoveRightIcon size={16} />}
        >
          More
        </CotopiaButton>
      )}
      dialogContentCss='w-[800px] max-w-full max-h-screen md:max-h-[calc(100vh-64px)] overflow-y-auto'
    >
      {(close) => <PayrollContractDetails contract={contract} onBack={close} />}
    </CDialog>
  );
}
