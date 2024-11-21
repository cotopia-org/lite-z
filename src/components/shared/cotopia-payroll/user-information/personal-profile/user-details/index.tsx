import { useAppSelector } from "@/store";

export default function PayrollUserDetails() {
    const user = useAppSelector((store) => store.auth.user);

    const userDetails = [
        { key: "User Name", value: user?.username },
        { key: "Name", value: user?.name },
        { key: "User Id", value: user?.id },
        { key: "Email", value: user?.email },

    ]

    return (
        <ul className="flex flex-col gap-y-4 w-full">
            {userDetails.map((userDetail) => (
                <li key={userDetail.key} className="w-full text-base shadow-md p-3 rounded-md border border-border font-semibold flex items-center justify-between">{userDetail.key}<span className="text-sm font-medium">{userDetail.value}</span></li>
            ))}
        </ul>
    )
}