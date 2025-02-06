import { useRef } from "react";
import CotopiaButton from "@/components/shared-ui/c-button";
import { FullModalBox } from "@/components/shared/modal-box";
import ToolButton from "@/components/shared/room/tools/tool-button";
import { Wallet } from "lucide-react";
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
                        className="bg-gray-200 p-2 text-center font-semibold rounded-sm"
                    >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta earum quo harum?
                    </span>
                    <CotopiaButton
                        className="w-full p-7"
                        onClick={handleCopyAddress}
                    >
                        Copy wallet address
                    </CotopiaButton>
                </>
            )}
        </FullModalBox>
    )
}