import CotopiaButton from "@/components/shared-ui/c-button";
import PopupBox from "@/components/shared/popup-box";
import PopupBoxChild from "@/components/shared/popup-box/child";
import { Wallet } from "lucide-react";

export default function PayrollButton() {

    const handleSendData = () => {
        const targetWindow = window.open("https://cotopia-payroll.vercel.app");
        const data = localStorage.getItem("persist:organization-panel");

        console.log("Sending Data...", data)
        if (targetWindow) {
            const parseData = JSON.parse(data!);
            const interval = setInterval(() => {
                targetWindow.postMessage(parseData.auth, "https://cotopia-payroll.vercel.app");
                clearInterval(interval);
            }, 1000);
        }
    };

    return (
        <PopupBox
            trigger={(open) => (
                <CotopiaButton
                    onClick={open}
                    startIcon={<Wallet size={22} />}
                    className="bg-white hover:bg-white text-black rounded-xl"
                >
                    Payroll
                </CotopiaButton>
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
                            220{" "}
                            <span className="text-gray-400 font-medium text-sm">USDT</span>
                        </span>
                    </div>
                    <hr />

                    <div className="my-4 flex items-center justify-between px-2">
                        <h3 className="text-lg font-semibold">Expected Payment</h3>
                        <span className="font-semibold text-black">
                            500{" "}
                            <span className="text-gray-400 font-medium text-sm">USDT</span>
                        </span>
                    </div>

                    <hr />
                    <CotopiaButton
                        onClick={handleSendData}
                        className="bg-black text-white rounded-xl mt-3"
                    >
                        More
                    </CotopiaButton>
                </PopupBoxChild>
            )}
        </PopupBox>
    );
}