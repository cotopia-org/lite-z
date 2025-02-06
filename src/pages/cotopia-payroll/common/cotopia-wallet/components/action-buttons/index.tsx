import SendMoney from "./send-button";
import ReceiveMoney from "./receive-button";

export default function WalletActionButton() {
    return (
        <div className="flex gap-x-4">
            <SendMoney />
            <ReceiveMoney/>        
        </div>
    )
}