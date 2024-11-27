import PayrollButton from "@/components/shared/room/tools/top-right/payroll-button";
import PayrollWrapper from "../payroll-wrapper";

export default function PayrollDashboard() {
    return (
        <PayrollWrapper>
            <div className="w-full h-screen flex items-start justify-center">
                {/* <h1 className="text-lg font-semibold text-gray-300">We don't have payments for users yet</h1> */}
                <PayrollButton />
            </div>
        </PayrollWrapper>
    )
}