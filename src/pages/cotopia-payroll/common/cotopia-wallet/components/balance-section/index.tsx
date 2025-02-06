import useGetBalance from '@/hooks/use-get-balance';
import { WalletType } from '@/types/wallet';
import { QRCodeSVG } from 'qrcode.react';

export default function BalanceSection() {
    const storedWallet = localStorage.getItem('wallet');
    const walletInfo: WalletType | null = storedWallet ? JSON.parse(storedWallet) as WalletType : null;
    const { walletBalance } = useGetBalance();


    return (
        <div className="bg-gradient-to-r from-indigo-800 via-purple-700 to-blue-500 w-full p-8 rounded-lg flex items-center justify-between shadow-md">
            <div className="flex flex-col gap-y-2 text-white">
                <span className='text-sm font-medium text-gray-200 -mt-6'>{walletInfo?.username}</span>
                <h2 className="text-lg font-medium">Total Balance</h2>
                <h3 className="text-3xl font-bold">${walletBalance}</h3>
                <span className="text-sm font-medium opacity-80">≈ {walletBalance} USDT</span>
            </div>

            {walletInfo?.walletAddress && (
                <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center relative">
                    <QRCodeSVG value={walletInfo.walletAddress} size={100} />
                    <img src='https://cryptologos.cc/logos/tether-usdt-logo.png?v=040' alt='USDT' className='w-7 absolute' />
                </div>
            )}

        </div>
    );
}