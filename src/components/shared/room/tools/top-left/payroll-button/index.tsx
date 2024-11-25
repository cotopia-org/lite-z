import CotopiaButton from "@/components/shared-ui/c-button";
import PopupBox from "@/components/shared/popup-box";
import PopupBoxChild from "@/components/shared/popup-box/child";
import { Wallet } from "lucide-react";
import ToolButton from "../../tool-button";
import ExpectedPayments from "./expected-payments";
import PreviousPayments from "./previous-payments";

export default function PayrollButton() {
    const currentURL = typeof window !== "undefined" ? window.location.href : "";
    const url = currentURL ? new URL(currentURL).origin : "";

    return (
        <PopupBox
            trigger={(open, isOpen) => (
                <ToolButton
                    open={open}
                    onClick={open}
                    startIcon={<Wallet size={20} />}
                    isOpen={isOpen}
                >
                    Payroll
                </ToolButton>
            )}
        >
            {(triggerPosition, open, close) => (
                <PopupBoxChild
                    onClose={close}
                    title="Cotopia Payroll"
                    width={400}
                    zIndex={triggerPosition.zIndex}
                    top={triggerPosition.top}
                    left={triggerPosition.left}
                >

                    <PreviousPayments />
                    <ExpectedPayments />

                    <div className="w-full flex justify-end">
                        <CotopiaButton
                            className="bg-primary text-white rounded-xl mt-3"
                        >
                            <a href={`${url}/payroll`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-x-5">
                                More
                            </a>
                        </CotopiaButton>
                    </div>
                </PopupBoxChild>
            )}
        </PopupBox>
    );
}
