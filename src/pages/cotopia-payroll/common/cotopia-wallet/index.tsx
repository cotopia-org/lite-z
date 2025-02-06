import TransactionsTable from "./components/transaction-table";
import BalanceSection from "./components/balance-section";
import WalletActionButton from "./components/action-buttons";
import CotopiaButton from "@/components/shared-ui/c-button";
import useAuth from "@/hooks/auth";
import axios from "axios";
import { Wallet } from "lucide-react";
import { useState } from "react";

function CotopiaWallet() {
    const [wallet , setWallet] = useState(localStorage.getItem('wallet'));
    const { user } = useAuth();

    const transactions = [
        { id: "001", date: "2025-02-05", address: "0xA123...B456", amount: "250 USDT", status: "Completed" as "Completed" },
        { id: "002", date: "2025-02-04", address: "0xC789...D012", amount: "500 USDT", status: "Pending" as "Pending" },
        { id: "003", date: "2025-02-03", address: "0xE345...F678", amount: "1,000 USDT", status: "Failed" as "Failed" },
    ];

    async function handelCreateWallet() {
        console.log(user.name)
        console.log(user.email)
        const response = await axios.post("http://localhost:8080/register", {
            username: user.name,
            email: user.email,
        });
        const data = await response.data.data;
        setWallet(data);
        localStorage.setItem("wallet", JSON.stringify(data));
        console.log(data);
    }

    return (
        <div className="w-full flex flex-col gap-y-8 p-3">

            <div className="border-b border-gray-300 pb-4">
                <h1 className="text-2xl font-semibold text-blue-800">Cotopia Wallet</h1>
            </div>

            {wallet ? (
                <>
                    <BalanceSection />
                    <WalletActionButton />
                    <TransactionsTable transactions={transactions} />
                </>
            ) : (
                <div className="h-screen flex flex-col items-center justify-center text-center gap-6 p-6 ">
                    <Wallet size={64} className="text-gray-500" />
                    <h2 className="text-2xl font-semibold text-gray-800">No Wallet Found</h2>
                    <p className="text-gray-600 font-semibold">
                        You haven't created a wallet yet. Click the button below to create your Cotopia wallet instantly.
                    </p>
                    <CotopiaButton
                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all"
                        onClick={handelCreateWallet}
                    >
                        Create Wallet
                    </CotopiaButton>
                </div>)}

        </div>
    );
};

export default CotopiaWallet;