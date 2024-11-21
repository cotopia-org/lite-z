import useUserContract from "@/hooks/contract";

interface Props {
    title: string;
    altTitle: "hired" | "end";
}

export default function PayrollUserInformationHeader({ title, altTitle }: Props) {
    const { userContract } = useUserContract();

    function formattedDate(contractDate: string) {
        const date = new Date(contractDate);
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }

    return (
        <div>
            <h1 className="text-lg font-semibold">{title}</h1>

            {userContract && (
                altTitle === "hired" ? (
                    <p className="text-sm font-semibold text-gray-400">Hired on {formattedDate(userContract.start_at)}</p>
                ) : (
                    <p className="text-sm font-semibold text-gray-400">Ends on {formattedDate(userContract.end_at)}</p>
                )
            )}
        </div>
    );
}