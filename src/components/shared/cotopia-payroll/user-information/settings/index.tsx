import CTabs from "@/components/shared-ui/c-tabs";
import AccountLogout from "@/components/shared/account-logout";
import { Cog, Timer, Wallet } from "lucide-react";
import MonthCountdown from "../../counter";
import EditPaymentAddress from "../../edit-payment-address";

export default function PayrollUserSettings() {
    return (
        <div className='p-6 flex flex-col gap-y-4'>
            <CTabs
                title={<AccountLogout />}
                dividerBetweenContentAndTabs
                defaultValue={"global-settings"}
                items={[
                    {
                        icon: <Cog />,
                        content: <EditPaymentAddress />,
                        value: "global-settings",
                    },
                    {
                        icon: <Timer />,
                        content: <MonthCountdown />,
                        value: "month-count",
                    },
                    {
                        icon: <Wallet/>,
                        content: <div>Payroll Settings</div>,
                        value: "payroll-settings",
                    }
                ]}
            />
        </div>
    )
}