import CotopiaInput from "@/components/shared-ui/c-input";
import { PayrollCreateContract } from "@/types/payroll-create-contract";

export default function PayrollContractInputs({ errors, touched, getFieldProps , selectedUser}: PayrollCreateContract) {
    return (
        <>
            <CotopiaInput
                {...getFieldProps("type")}
                placeholder="Enter the type"
                label="Contract type"
                type="text"
                hasError={!!touched.type && !!errors.type}
                helperText={touched.type && typeof errors.type === "string" ? errors.type : ""}
            />

            <CotopiaInput
                {...getFieldProps("amount")}
                placeholder="Enter the amount"
                label="Contract amount"
                type="number"
                hasError={!!touched.amount && !!errors.amount}
                helperText={touched.amount && typeof errors.amount === "number" ? errors.amount : ""}
            />

            <CotopiaInput
                {...getFieldProps("currency")}
                placeholder="Enter the currency"
                label="Contract currency"
                type="text"
                hasError={!!touched.currency && !!errors.currency}
                helperText={touched.currency && typeof errors.currency === "string" ? errors.currency : ""}
            />

            <CotopiaInput
                {...getFieldProps("end_at")}
                placeholder="Enter the expiration date (YYYY-MM-DD)"
                label="Contract end at"
                type="date"
                hasError={!!touched.end_at && !!errors.end_at}
                helperText={touched.end_at && typeof errors.end_at === "string" ? errors.end_at : ""}
            />

            <CotopiaInput
                {...getFieldProps("auto_renewal")}
                placeholder="Enter auto renewal status"
                label="Auto Renewal"
                type="number"
                hasError={!!touched.auto_renewal && !!errors.auto_renewal}
                helperText={touched.auto_renewal && typeof errors.auto_renewal === "string" ? errors.auto_renewal : ""}
            />

            <CotopiaInput
                {...getFieldProps("renewal_count")}
                placeholder="Enter renewal count"
                label="Renewal Count"
                type="number"
                hasError={!!touched.renewal_count && !!errors.renewal_count}
                helperText={touched.renewal_count && typeof errors.renewal_count === "string" ? errors.renewal_count : ""}
            />

            <CotopiaInput
                {...getFieldProps("renew_time_period_type")}
                placeholder="Enter renewal time period type"
                label="Renew Time Period Type"
                type="text"
                hasError={!!touched.renew_time_period_type && !!errors.renew_time_period_type}
                helperText={touched.renew_time_period_type && typeof errors.renew_time_period_type === "string" ? errors.renew_time_period_type : ""}
            />

            <CotopiaInput
                {...getFieldProps("renew_time_period")}
                placeholder="Enter renewal time period"
                label="Renew Time Period"
                type="number"
                hasError={!!touched.renew_time_period && !!errors.renew_time_period}
                helperText={touched.renew_time_period && typeof errors.renew_time_period === "string" ? errors.renew_time_period : ""}
            />

            <CotopiaInput
                {...getFieldProps("renew_notice")}
                placeholder="Enter renewal notice"
                label="Renew Notice"
                type="number"
                hasError={!!touched.renew_notice && !!errors.renew_notice}
                helperText={touched.renew_notice && typeof errors.renew_notice === "string" ? errors.renew_notice : ""}
            />

            <CotopiaInput
                {...getFieldProps("user_status")}
                placeholder="Enter user status"
                label="User Status"
                type="text"
                hasError={!!touched.user_status && !!errors.user_status}
                helperText={touched.user_status && typeof errors.user_status === "string" ? errors.user_status : ""}
            />

            <CotopiaInput
                {...getFieldProps("contractor_status")}
                placeholder="Enter contractor status"
                label="Contractor Status"
                type="text"
                hasError={!!touched.contractor_status && !!errors.contractor_status}
                helperText={touched.contractor_status && typeof errors.contractor_status === "string" ? errors.contractor_status : ""}
            />

            <CotopiaInput
                {...getFieldProps("min_hours")}
                placeholder="Enter minimum hours"
                label="Min Hours"
                type="number"
                hasError={!!touched.min_hours && !!errors.min_hours}
                helperText={touched.min_hours && typeof errors.min_hours === "string" ? errors.min_hours : ""}
            />

            <CotopiaInput
                {...getFieldProps("max_hours")}
                placeholder="Enter maximum hours"
                label="Max Hours"
                type="number"
                hasError={!!touched.max_hours && !!errors.max_hours}
                helperText={touched.max_hours && typeof errors.max_hours === "string" ? errors.max_hours : ""}
            />

            <CotopiaInput
                {...getFieldProps("payment_method")}
                placeholder="Enter payment method"
                label="Payment Method"
                type="text"
                hasError={!!touched.payment_method && !!errors.payment_method}
                helperText={touched.payment_method && typeof errors.payment_method === "string" ? errors.payment_method : ""}
            />

            <CotopiaInput
                {...getFieldProps("payment_address")}
                placeholder="Enter payment address"
                label="Payment Address"
                type="text"
                hasError={!!touched.payment_address && !!errors.payment_address}
                helperText={touched.payment_address && typeof errors.payment_address === "string" ? errors.payment_address : ""}
            />

            <CotopiaInput
                {...getFieldProps("payment_period")}
                placeholder="Enter payment period"
                label="Payment Period"
                type="text"
                hasError={!!touched.payment_period && !!errors.payment_period}
                helperText={touched.payment_period && typeof errors.payment_period === "string" ? errors.payment_period : ""}
            />

            <CotopiaInput
                {...getFieldProps("role")}
                placeholder="Enter role"
                label="Role"
                type="text"
                hasError={!!touched.role && !!errors.role}
                helperText={touched.role && typeof errors.role === "string" ? errors.role : ""}
            />

            <CotopiaInput
                {...getFieldProps("user_sign_status")}
                placeholder="Enter user sign status"
                label="User Sign Status"
                type="number"
                hasError={!!touched.user_sign_status && !!errors.user_sign_status}
                helperText={touched.user_sign_status && typeof errors.user_sign_status === "string" ? errors.user_sign_status : ""}
            />

            <CotopiaInput
                {...getFieldProps("contractor_sign_status")}
                placeholder="Enter contractor sign status"
                label="Contractor Sign Status"
                type="number"
                hasError={!!touched.contractor_sign_status && !!errors.contractor_sign_status}
                helperText={touched.contractor_sign_status && typeof errors.contractor_sign_status === "string" ? errors.contractor_sign_status : ""}
            />

            <CotopiaInput
                {...getFieldProps("user_id")}
                placeholder="Enter the user id"
                label="User id"
                type="number"
                value={selectedUser?.id || ""}
                disabled
                hasError={!!touched.user_id && !!errors.user_id}
                helperText={touched.user_id && typeof errors.user_id === "number" ? errors.user_id : ""}
            />

        </>
    )
}