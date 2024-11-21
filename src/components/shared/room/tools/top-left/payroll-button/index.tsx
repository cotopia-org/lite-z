import CotopiaButton from "@/components/shared-ui/c-button";
import PopupBox from "@/components/shared/popup-box";
import PopupBoxChild from "@/components/shared/popup-box/child";
import { Wallet } from "lucide-react";
import ToolButton from "../../tool-button";
import { Link } from "react-router-dom";

export default function PayrollButton() {
    const currentURL = window.location.href;
    const url = new URL(currentURL);

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
                    <div className="my-4 flex items-center justify-between px-2">
                        <h3 className="text-lg font-semibold">Previous Payment</h3>
                        <span className="font-semibold text-black">
                            220
                            <span className="text-gray-400 font-medium text-sm">USDT</span>
                        </span>
                    </div>
                    <hr />

                    <div className="my-4 flex items-center justify-between px-2">
                        <h3 className="text-lg font-semibold">Expected Payment</h3>
                        <span className="font-semibold text-black">
                            500
                            <span className="text-gray-400 font-medium text-sm">USDT</span>
                        </span>
                    </div>

                    <hr />
                    <CotopiaButton
                        className="bg-black text-white rounded-xl mt-3"
                    >
                        <Link to={`${url}/payroll`}>
                            More
                        </Link>
                    </CotopiaButton>
                </PopupBoxChild>
            )}
        </PopupBox>
    );
}