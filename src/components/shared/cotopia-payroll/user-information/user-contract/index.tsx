import PayrollUserInformationHeader from "../header"
import PayrollActiveJobs from "./active-jobs"
import PayrollContractDetails from "./contract-details"

export default function PayrollUserContract() {

    return (
        <div className="flex-1 flex flex-col gap-y-5">
            <PayrollUserInformationHeader title="User Contract" altTitle="end" />
            <PayrollActiveJobs />
            <PayrollContractDetails />
        </div>
    )
}