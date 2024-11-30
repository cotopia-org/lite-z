import PayrollWrapper from "../payroll-wrapper";
import Payments from "./payment-table/payment-table";

export default function PayrollPayments() {
    return (
        <PayrollWrapper>
            <Payments/>
        </PayrollWrapper>
    )
}