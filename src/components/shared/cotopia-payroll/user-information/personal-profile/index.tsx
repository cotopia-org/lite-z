import PayrollUserInformationHeader from "../header"
import PayrollUserAvatar from "./user-avatar";
import PayrollUserDetails from "./user-details";

export default function PayrollPersonalProfile() {
    return (
        <div className="w-2/5 bg-white shadow-lg border border-border p-3 rounded-md flex flex-col gap-y-5">
            <PayrollUserInformationHeader title="Personal Profile" altTitle="hired" />

            <div className="w-full flex flex-col items-center gap-y-5">
                <PayrollUserAvatar />
                <PayrollUserDetails />
            </div>

        </div>
    )
}