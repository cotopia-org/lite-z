import CotopiaButton from "@/components/shared-ui/c-button";
import CDialog from "@/components/shared-ui/c-dialog";
import { UserContractType } from "@/types/contract";
import InsertButtonForm from "./form";
import { ArrowRight } from "lucide-react";

type Props = {
  contract: UserContractType;
  onUpdate?: (contract: UserContractType) => void;
};
export default function InsertButton({ contract, onUpdate }: Props) {
  return (
    <CDialog
      trigger={(open) => (
        <CotopiaButton variant={"link"} endIcon={<ArrowRight />} onClick={open}>
          Insert payment address
        </CotopiaButton>
      )}
    >
      {(close) => (
        <InsertButtonForm
          contract={contract}
          onSave={(contract) => {
            if (onUpdate) onUpdate(contract);
            close();
          }}
        />
      )}
    </CDialog>
  );
}
