import PayrollSectionTitle from "../sections-title";

export default function PayrollContractDetails() {

    const contractDetails = [
        { key: "Contract Type", value: "...." },
        { key: "Currency", value: "...." },
        { key: "Start at", value: "...." },
        { key: "End at", value: "...." },
        { key: "Created at", value: "...." },
        { key: "Updated at", value: "...." },
        { key: "Min hours", value: "...." },
        { key: "Max hours", value: "...." },
        { key: "User role", value: "...." },
        { key: "Amount", value: "...." },
        { key: "Contractor Status", value: "...." },
        { key: "Auto Renewal", value: "...." },
        { key: "Payment address", value: "...." },
    ]

    return (
        <>
            <PayrollSectionTitle title="User Contract" />

            <ul className="grid grid-cols-12 gap-4 w-full">
                {contractDetails.map((contractDetail, index) => (
                    <li key={contractDetail.key} className={`w-full text-base shadow-md p-3 rounded-md border border-border font-semibold flex items-center justify-between ${index === contractDetails.length - 1 ? "col-span-12" : "col-span-6"}`}>{contractDetail.key}<span className="text-sm font-medium">{contractDetail.value}</span></li>
                ))}
            </ul>
        </>
    )
}