import PayrollActiveJobs from "./active-jobs"
import PayrollContractDetails from "./contract-details"

export default function PayrollUserContract() {

    return (
        <div className="flex-1 flex flex-col gap-y-5">
            <PayrollActiveJobs />
            <PayrollContractDetails />
        </div>
    )
}