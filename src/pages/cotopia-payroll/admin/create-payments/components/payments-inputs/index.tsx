import CotopiaInput from "@/components/shared-ui/c-input";
import { PayrollCreateContract } from "@/types/payroll-create-contract";

export default function PaymentsInputs({ errors, touched, getFieldProps, values, userContract, selectedUser }: PayrollCreateContract) {
    return (
        <>
            <CotopiaInput
                {...getFieldProps("type")}
                placeholder="Enter the type"
                label="Payment type"
                type="text"
                hasError={!!touched.type && !!errors.type}
                helperText={touched.type && typeof errors.type === "string" ? errors.type : ""}
            />

            <CotopiaInput
                {...getFieldProps("status")}
                placeholder="Enter the status"
                label="Payment status"
                type="number"
                hasError={!!touched.status && !!errors.status}
                helperText={touched.status && typeof errors.status === "number" ? errors.status : ""}
            />

            <CotopiaInput
                {...getFieldProps("bonus")}
                placeholder="Enter the bonus"
                label="Payment bonus"
                type="number"
                hasError={!!touched.bonus && !!errors.bonus}
                helperText={touched.bonus && typeof errors.bonus === "number" ? errors.bonus : ""}
            />

            <CotopiaInput
                {...getFieldProps("round")}
                placeholder="Enter the round"
                label="Payment round"
                type="number"
                disabled
                hasError={!!touched.round && !!errors.round}
                helperText={touched.type && typeof errors.type === "number" ? errors.type : ""}
            />

            <CotopiaInput
                {...getFieldProps("total_hours")}
                placeholder="Enter the total hours"
                label="Total hours"
                type="number"
                hasError={!!touched.total_hours && !!errors.total_hours}
                helperText={touched.total_hours && typeof errors.total_hours === "number" ? errors.total_hours : ""}
            />

            <CotopiaInput
                {...getFieldProps("total_amount")}
                placeholder="Enter the total amount"
                label="Total amount"
                type="number"
                value={(userContract?.amount ?? 0) * values?.total_hours + values?.bonus}
                disabled
                hasError={!!touched.contract_id && !!errors.contract_id}
                helperText={touched.contract_id && typeof errors.contract_id === "number" ? errors.contract_id : ""}
            />

            <CotopiaInput
                {...getFieldProps("contract_amount")}
                placeholder="Enter the contract amount"
                label="Contract amount"
                type="number"
                value={userContract?.amount || ""}
                disabled
                hasError={!!touched.contract_id && !!errors.contract_id}
                helperText={touched.contract_id && typeof errors.contract_id === "number" ? errors.contract_id : ""}
            />

            <CotopiaInput
                {...getFieldProps("contract_id")}
                placeholder="Enter the contract id"
                label="Contract id"
                type="number"
                value={userContract?.id || ""}
                disabled
                hasError={!!touched.contract_id && !!errors.contract_id}
                helperText={touched.contract_id && typeof errors.contract_id === "number" ? errors.contract_id : ""}
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