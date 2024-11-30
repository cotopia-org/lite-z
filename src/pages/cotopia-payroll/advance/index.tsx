import PayrollWrapper from "../payroll-wrapper";
import PayrollAddAdvance from "./add-advance";
import AdvanceRequest from "./advance-table/advance-table";

export default function PayrollAdvance() {
    return (
        <PayrollWrapper>
            <AdvanceRequest/>
            <PayrollAddAdvance />
        </PayrollWrapper>
    )
}