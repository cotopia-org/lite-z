import CotopiaButton from "@/components/shared-ui/c-button";
import CotopiaInput from "@/components/shared-ui/c-input";
import { FullModalBox } from "@/components/shared/modal-box";
import ToolButton from "@/components/shared/room/tools/tool-button";
import { Send } from "lucide-react";

export default function SendMoney() {
    const style = "flex-1 bg-blue-500 hover:bg-blue-600 transition-all duration-300 ease-in-out rounded-lg p-4 flex flex-col items-center justify-center text-white shadow-md";
   
    return (
        <FullModalBox
            title="Send Money"
            trigger={(open, isOpen) => (
                <div className={style}>
                    <Send size={20} />
                    <ToolButton
                        startIcon={<></>}
                        open={open}
                        isOpen={isOpen}
                        className="bg-transparent text-white hover:!text-white"
                    >
                        Send Money
                    </ToolButton>
                </div>
            )}
            className="w-[640px]"
        >
            {() => (
                <>
                    <CotopiaInput label="Amount" type="number" placeholder="Enter the amount" />
                    <CotopiaInput label="Address" placeholder="Enter the address" />
                    <CotopiaInput label="Private Key" placeholder="Enter you're private key" />
                    <CotopiaButton className="p-7">Send</CotopiaButton>
                </>
            )}
        </FullModalBox>
    )
}