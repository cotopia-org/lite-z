import CotopiaButton from "@/components/shared-ui/c-button";
import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import CotopiaInput from "@/components/shared-ui/c-input";
import CotopiaTextarea from "@/components/shared-ui/c-textarea";
import CotopiaTooltip from "@/components/shared-ui/c-tooltip";
import ModalBox from "@/components/shared/modal-box";
import { Plus } from "lucide-react";
import { FormEvent } from "react";
import { toast } from "sonner";

export default function PayrollAddAdvance() {

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        toast.success("You're request have been sent!")
    }

    return (
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
                <form className="flex flex-col gap-y-6" onSubmit={handleSubmit}>
                    <CotopiaInput
                        placeholder="Enter the advance amount"
                        label="Advance amount"
                        required
                    />
                    <CotopiaTextarea placeholder="Eg:i need cover a new course on udemy ..." label="Advance description" rows={8} minLength={10} required />
                    <CotopiaButton
                        type="submit"
                    >
                        Create
                    </CotopiaButton>
                </form>)}
        </ModalBox>
    )
}