import CotopiaButton from "@/components/shared-ui/c-button";
import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import CotopiaInput from "@/components/shared-ui/c-input";
import CotopiaTextarea from "@/components/shared-ui/c-textarea";
import CotopiaTooltip from "@/components/shared-ui/c-tooltip";
import ModalBox from "@/components/shared/modal-box";
import { useAppSelector } from "@/store";
import axios from "axios";
import { Plus } from "lucide-react";
import { FormEvent } from "react";
import { toast } from "sonner";

export default function PayrollAddAdvance() {
  const userData = useAppSelector((store) => store.auth);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        const advanceAmount = formData.get("advance-amount"); 
        // const advanceDescription = formData.get("advance-description"); 

       await axios.post(`https://lite-api.cotopia.social/api/payments/`, {
              type: "advance",
              amount: advanceAmount,
              bonus: 0,
              round:0,
              total_hours:0,
              user_id: userData.user?.id,
              contract_id: 1,
              status: "under review"
        }, {
            headers: {
                Authorization: `Bearer ${userData.accessToken}`,
              },
        })

        toast.success("Your request has been sent!");
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
                        name="advance-amount" 
                        type="number"
                        placeholder="Enter the advance amount"
                        label="Advance amount"
                        required
                    />
                    <CotopiaTextarea
                        name="advance-description" 
                        placeholder="Eg: I need to cover a new course on Udemy ..."
                        label="Advance description"
                        rows={8}
                        minLength={10}
                        required
                    />
                    <CotopiaButton type="submit">
                        Create
                    </CotopiaButton>
                </form>
            )}
        </ModalBox>
    );
}
