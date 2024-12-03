import UploadAvatar from "@/components/shared/user-actions-avatar-button/settings/additional-information/upload-avatar";
import PayrollUserInformationHeader from "../header"
import PayrollUserAvatar from "./user-avatar";
import PayrollUserDetails from "./user-details";

export default function PayrollPersonalProfile() {
    return (
        <div className="w-full flex flex-col items-center justify-center gap-y-5">
            <div className="w-full flex flex-col items-center gap-y-5">
                <UploadAvatar showLabel={false}/>
                <PayrollUserDetails />
            </div>

        </div>
    )
}