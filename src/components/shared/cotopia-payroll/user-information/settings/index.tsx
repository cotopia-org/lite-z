import CTabs from "@/components/shared-ui/c-tabs";
import AccountLogout from "@/components/shared/account-logout";
import { Timer } from "lucide-react";
import MonthCountdown from "../../counter";

export default function PayrollUserSettings() {
    return (
        <div className='p-6 flex flex-col gap-y-4'>
            <CTabs
                title={<AccountLogout />}
                dividerBetweenContentAndTabs
                defaultValue={"global-settings"}
                items={[
                    {
                        icon: <Timer />,
                        content: <MonthCountdown />,
                        value: "month-count",
                    },
                ]}
            />
        </div>
    )
}