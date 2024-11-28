import PayrollWrapper from "../payroll-wrapper";

export default function PayrollDashboard() {
    return (
        <PayrollWrapper>
            <div className="w-full h-screen flex items-center justify-center">
                <h1 className="text-lg font-semibold text-gray-300">We don't have payments for users yet</h1>
            </div>
        </PayrollWrapper>
    )
}