import PayrollWrapper from "../payroll-wrapper";

export default function PayrollPayments() {
    return (
        <PayrollWrapper>
            <div className="w-full h-screen flex items-center justify-center">
                <h1 className="text-lg font-semibold text-gray-300">No have payments yet</h1>
            </div>
        </PayrollWrapper>
    )
}