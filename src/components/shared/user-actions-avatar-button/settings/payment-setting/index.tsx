import CotopiaButton from "@/components/shared-ui/c-button";
import ExpectedPayments from "@/components/shared/room/tools/top-left/payroll-button/expected-payments";
import PreviousPayments from "@/components/shared/room/tools/top-left/payroll-button/previous-payments";
import { Plus } from "lucide-react";

export default function PaymentsSettings() {
    const currentURL = typeof window !== "undefined" ? window.location.href : "";
    const url = currentURL ? new URL(currentURL).origin : "";

    return (
        <>
            <ExpectedPayments />
            <PreviousPayments />
            <CotopiaButton
                className="bg-primary text-white rounded-xl mt-3 flex w-full items-end"
            >

                <a href={`${url}/payroll`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-x-5">
                    <Plus /> More
                </a>
            </CotopiaButton>
        </>
    )
}