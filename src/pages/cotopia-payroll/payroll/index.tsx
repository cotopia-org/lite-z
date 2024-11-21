import PayrollPersonalProfile from "@/components/shared/cotopia-payroll/user-information/personal-profile";
import PayrollWrapper from "../payroll-wrapper";
import PayrollUserContract from "@/components/shared/cotopia-payroll/user-information/user-contract";

export default function PayrollPage() {
    return (
        <PayrollWrapper>
            <div className="flex gap-3 flex-1 p-3">
                <PayrollPersonalProfile />
                <PayrollUserContract />
            </div>
        </PayrollWrapper>
    )
}