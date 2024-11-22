import PayrollPersonalProfile from "@/components/shared/cotopia-payroll/user-information/personal-profile";
import PayrollWrapper from "../payroll-wrapper";
import PayrollUserContract from "@/components/shared/cotopia-payroll/user-information/user-contract";
import ModalBox from "@/components/shared/modal-box";
import CotopiaTooltip from "@/components/shared-ui/c-tooltip";
import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import { Plus } from "lucide-react";
import CotopiaInput from "@/components/shared-ui/c-input";
import CotopiaButton from "@/components/shared-ui/c-button";
import CotopiaTextarea from "@/components/shared-ui/c-textarea";

export default function PayrollPage() {
    return (
        <PayrollWrapper>
            <div className="flex gap-3 flex-1 p-3">
                <PayrollPersonalProfile />
                <PayrollUserContract />
            </div>


            <ModalBox
                trigger={(open) => (
                    <CotopiaTooltip title="New Advance">
                        <CotopiaIconButton onClick={open} className="text-black w-12 h-12 absolute bottom-3 right-3">
                            <Plus />
                        </CotopiaIconButton>
                    </CotopiaTooltip>
                )}
            >
                {(_, close) => (
                    <form className="flex flex-col gap-y-6">
                        <CotopiaInput
                            placeholder="Enter the advance amount"
                            label="Advance amount"
                        />
                        <CotopiaTextarea placeholder="Eg:i need cover a new course on udemy ..." label="Advance description" />
                        <CotopiaButton
                            type="submit"
                        >
                            Create
                        </CotopiaButton>
                    </form>)}
            </ModalBox>
        </PayrollWrapper>
    )
}