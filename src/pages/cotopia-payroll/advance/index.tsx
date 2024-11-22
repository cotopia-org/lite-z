import PayrollWrapper from "../payroll-wrapper";
import PayrollAddAdvance from "./add-advance";

export default function PayrollAdvance() {
    return (
        <PayrollWrapper>
            <div className="w-full h-screen flex items-center justify-center">
                <h1 className="text-lg font-semibold text-gray-300">No have advance requests yet</h1>
            </div>
            <PayrollAddAdvance />
        </PayrollWrapper>
    )
}