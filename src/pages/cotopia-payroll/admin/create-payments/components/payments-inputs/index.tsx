import CotopiaDropdown from "@/components/shared-ui/c-dropdown";
import CotopiaInput from "@/components/shared-ui/c-input";
import { PayrollCreateContract } from "@/types/payroll-create-contract";

export default function PaymentsInputs({
  errors,
  touched,
  getFieldProps,
  setFieldValue,
  values,
  userContract,
  selectedUser,
}: PayrollCreateContract) {
  return (
    <>
      <CotopiaDropdown
        items={[
          { title: "Salary", value: "salary" },
          { title: "Advance", value: "advance" },
        ]}
        onSelect={(item) => setFieldValue("type", item.value)}
        label='Payment type'
        defaultValue={values?.type}
        triggerClassName='h-10'
      />

      <CotopiaDropdown
        items={[
          { title: "Pending", value: "pending" },
          { title: "Paid", value: "paid" },
        ]}
        onSelect={(item) => setFieldValue("status", item.value)}
        label='Payment status'
        defaultValue={values?.status}
      />

      <CotopiaInput
        {...getFieldProps("bonus")}
        placeholder='Enter the bonus'
        label='Payment bonus'
        type='number'
        hasError={!!touched.bonus && !!errors.bonus}
        helperText={
          touched.bonus && typeof errors.bonus === "number" ? errors.bonus : ""
        }
      />

      <CotopiaInput
        {...getFieldProps("round")}
        placeholder='Enter the round'
        label='Payment round'
        type='number'
        hasError={!!touched.round && !!errors.round}
        helperText={
          touched.type && typeof errors.type === "number" ? errors.type : ""
        }
      />

      <CotopiaInput
        {...getFieldProps("total_hours")}
        placeholder='Enter the total hours'
        label='Total hours'
        type='number'
        hasError={!!touched.total_hours && !!errors.total_hours}
        helperText={
          touched.total_hours && typeof errors.total_hours === "number"
            ? errors.total_hours
            : ""
        }
      />

      <CotopiaInput
        {...getFieldProps("total_amount")}
        placeholder='Enter the total amount'
        label='Total amount'
        type='number'
        hasError={!!touched.contract_id && !!errors.contract_id}
        helperText={
          touched.contract_id && typeof errors.contract_id === "number"
            ? errors.contract_id
            : ""
        }
      />

      <CotopiaInput
        {...getFieldProps("user_id")}
        placeholder='Enter the user id'
        label='User id'
        type='number'
        value={values?.user_id || selectedUser?.id || ""}
        disabled
        hasError={!!touched.user_id && !!errors.user_id}
        helperText={
          touched.user_id && typeof errors.user_id === "number"
            ? errors.user_id
            : ""
        }
      />
    </>
  );
}
