import useUserContract from "@/hooks/contract";
import PayrollSectionTitle from "../sections-title";

export default function PayrollContractDetails() {
    const { userContract, isLoading } = useUserContract();

    function formattedDate(contractDate: string) {
        const date = new Date(contractDate);
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }

    const contractDetails = [
        { key: "Contract Type", value: userContract?.type },
        { key: "Currency", value: userContract?.currency },
        { key: "Start at", value: formattedDate(userContract?.start_at!) },
        { key: "End at", value: formattedDate(userContract?.end_at!) },
        { key: "Created at", value: formattedDate(userContract?.created_at!) },
        { key: "Updated at", value: formattedDate(userContract?.updated_at!) },
        { key: "Min hours", value: userContract?.min_hours },
        { key: "Max hours", value: userContract?.max_hours },
        { key: "User role", value: userContract?.role },
        { key: "Amount", value: userContract?.amount },
        { key: "Contractor Status", value: userContract?.contractor_status },
        { key: "Auto Renewal", value: userContract?.auto_renewal },
        { key: "Payment method", value: userContract?.payment_method },
        { key: "Contract id", value: userContract?.id },
        { key: "Payment address", value: userContract?.payment_address },
    ];

    return (
        <>
            <PayrollSectionTitle title="User Contract" />
            {isLoading ? (
                <p className="text-gray-400 text-xl font-semibold text-center">
                    Loading contract details...
                </p>
            ) : userContract ? (
                <ul className="grid grid-cols-12 gap-4 w-full">
                    {contractDetails.map((contractDetail, index) => (
                        <li key={contractDetail.key} className={`w-full text-base shadow-md p-3 rounded-md border border-border font-semibold flex items-center justify-between bg-gray-50 ${index === contractDetails.length - 1 ? "col-span-12" : "col-span-6"}`}>{contractDetail.key}<span className="text-sm font-medium">{contractDetail.value}</span></li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-400 text-xl font-semibold text-center">
                    You don't have any contract yet.
                </p>
            )}
        </>
    );
}
