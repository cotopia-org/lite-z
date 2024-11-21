import PayrollUserInformationHeader from "../header"
import PayrollActiveJobs from "./active-jobs"
import PayrollContractDetails from "./contract-details"

export default function PayrollUserContract() {

    return (
        <div className="flex-1 bg-white shadow-lg border border-border p-3 rounded-md flex flex-col gap-y-5">
            <PayrollUserInformationHeader title="User Contract" altTitle="Ends in Feb 25 , 2050" />
            {/* <PayrollActiveJobs /> */}
            <PayrollContractDetails />
        </div>
    )
}