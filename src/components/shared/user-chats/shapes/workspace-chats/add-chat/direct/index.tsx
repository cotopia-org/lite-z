import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import CotopiaTooltip from "@/components/shared-ui/c-tooltip";
import ModalBox from "@/components/shared/modal-box";
import { UserRoundPen } from "lucide-react";
import AddDirectForm from "./form";

export default function AddDirect() {
  return (
    <ModalBox
      trigger={(open) => (
        <CotopiaTooltip title='Send direct'>
          <CotopiaIconButton onClick={open} className='text-black w-12 h-12'>
            <UserRoundPen />
          </CotopiaIconButton>
        </CotopiaTooltip>
      )}
    >
      {(_, close) => <AddDirectForm onCreateChat={close} />}
    </ModalBox>
  );
}
