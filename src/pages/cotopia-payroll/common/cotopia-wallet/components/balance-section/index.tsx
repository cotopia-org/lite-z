import { QRCodeSVG } from 'qrcode.react';

export default function BalanceSection() {
    return (
        <div className="bg-gradient-to-r from-indigo-800 via-purple-700 to-blue-500 w-full p-8 rounded-lg flex items-center justify-between shadow-md">
            <div className="flex flex-col gap-y-2 text-white">
                <h2 className="text-lg font-medium">Total Balance</h2>
                <h3 className="text-3xl font-bold">$12,450.00</h3>
                <span className="text-sm font-medium opacity-80">≈ 12,450.00 USDT</span>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center relative">
                <QRCodeSVG value={"YOUSSEF_SAMEH_SAPRY"} size={100} />
                <img src='https://cryptologos.cc/logos/tether-usdt-logo.png?v=040'  alt='youssef' className='w-7 absolute'/>
            </div>
        </div>
    )
}