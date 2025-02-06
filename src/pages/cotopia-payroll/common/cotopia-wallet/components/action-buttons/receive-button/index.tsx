import { useRef } from "react";
import CotopiaButton from "@/components/shared-ui/c-button";
import { FullModalBox } from "@/components/shared/modal-box";
import ToolButton from "@/components/shared/room/tools/tool-button";
import { Copy, Wallet } from "lucide-react";
import { toast } from "sonner";

export default function ReceiveMoney() {
    const style = "flex-1 bg-green-500 hover:bg-green-600 transition-all duration-300 ease-in-out rounded-lg p-4 flex flex-col items-center justify-center text-white shadow-md";
    const walletAddressRef = useRef<HTMLSpanElement>(null);

    const handleCopyAddress = () => {
        const address = walletAddressRef.current?.textContent;
        if (address) {
            navigator.clipboard.writeText(address)
                .then(() => toast.success("Wallet address copied to clipboard!"))
                .catch(err => console.error("Failed to copy:", err));
        }
    };

    return (
        <FullModalBox
            title="Receive Money"
            trigger={(open, isOpen) => (
                <div className={style}>
                    <Wallet size={20} />
                    <ToolButton
                        startIcon={<></>}
                        open={open}
                        isOpen={isOpen}
                        className="bg-transparent text-white hover:!text-white"
                    >
                        Receive Money
                    </ToolButton>
                </div>
            )}
            className="w-[640px]"
        >
            {() => (
                <>
                    <span
                        ref={walletAddressRef}
                        className="bg-gray-100 p-3 rounded-lg shadow-md text-gray-800 font-semibold w-full text-center"
                    >
                        0xA1b2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0
                    </span>

                    <CotopiaButton
                        className="w-full flex items-center justify-center gap-x-2 p-4 bg-blue-600 hover:bg-blue-700 transition-all rounded-lg text-white font-semibold shadow-md"
                        onClick={handleCopyAddress}
                    >
                        <Copy size={18} /> Copy Wallet Address
                    </CotopiaButton>
                </>
            )}
        </FullModalBox>
    )
}