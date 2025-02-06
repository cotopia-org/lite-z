import CotopiaButton from "@/components/shared-ui/c-button";
import CotopiaInput from "@/components/shared-ui/c-input";
import { FullModalBox } from "@/components/shared/modal-box";
import ToolButton from "@/components/shared/room/tools/tool-button";
import useAuth from "@/hooks/auth";
import useGetBalance from "@/hooks/use-get-balance";
import axios from "axios";
import { Send } from "lucide-react";
import { useState } from "react";

export default function SendMoney() {
    const style = "flex-1 bg-blue-500 hover:bg-blue-600 transition-all duration-300 ease-in-out rounded-lg p-4 flex flex-col items-center justify-center text-white shadow-md";
    const [sendTo, setSendTo] = useState<string>("");
    const [amount, setAmount] = useState<number>();
    const { walletBalance } = useGetBalance();
    const { user } = useAuth();

    async function sendMoney() {
        const response = await axios.post(`http://localhost:8080/send-money`, {
            to: sendTo,
            amount: amount,
            email: user.email,
        });

        const data = await response.data;

        console.log(data);
    }

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
                <form onSubmit={sendMoney} className="w-full flex flex-col gap-y-5">
                    <CotopiaInput label="Amount" type="number" placeholder="Enter the amount" value={amount} onChange={(e) => setAmount(+e.target.value)} required />
                    <span className="text-xs -mt-4 ml-2 font-semibold text-gray-700">Available balance : <span className="text-green-500">{walletBalance} USDT</span></span>
                    <CotopiaInput label="Address" placeholder="Enter the address" value={sendTo} onChange={(e) => setSendTo(e.target.value)} required />
                    <CotopiaButton className="p-7">Send</CotopiaButton>
                </form>
            )}
        </FullModalBox>
    )
}