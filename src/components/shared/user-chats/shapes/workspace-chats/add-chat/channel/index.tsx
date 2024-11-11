import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import CotopiaTooltip from "@/components/shared-ui/c-tooltip";
import ModalBox from "@/components/shared/modal-box";
import { MessageSquare } from "lucide-react";

export default function AddChannel() {
  return (
    <ModalBox
      trigger={(open) => (
        <CotopiaTooltip title='Add channel'>
          <CotopiaIconButton onClick={open} className='text-black w-12 h-12'>
            <MessageSquare />
          </CotopiaIconButton>
        </CotopiaTooltip>
      )}
    >
      {(open) => <>xx</>}
    </ModalBox>
  );
}
