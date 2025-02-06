import TransactionsTable from "./components/transaction-table";
import BalanceSection from "./components/balance-section";
import WalletActionButton from "./components/action-buttons";

function CotopiaWallet() {

    const transactions = [
        { id: "001", date: "2025-02-05", address: "0xA123...B456", amount: "250 USDT", status: "Completed" as "Completed" },
        { id: "002", date: "2025-02-04", address: "0xC789...D012", amount: "500 USDT", status: "Pending" as "Pending" },
        { id: "003", date: "2025-02-03", address: "0xE345...F678", amount: "1,000 USDT", status: "Failed" as "Failed" },
    ];

    return (
        <div className="w-full flex flex-col gap-y-8 py-6 rounded-lg shadow-xl">
          
            <div className="border-b border-gray-300 pb-4">
                <h1 className="text-2xl font-semibold text-blue-800">Cotopia Wallet</h1>
            </div>

            <BalanceSection />
            <WalletActionButton />
            <TransactionsTable transactions={transactions} />
        
        </div>
    );
};

export default CotopiaWallet;