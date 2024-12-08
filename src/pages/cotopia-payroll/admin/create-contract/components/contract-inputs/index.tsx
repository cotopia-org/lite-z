import CotopiaDropdown from "@/components/shared-ui/c-dropdown";
import CotopiaInput from "@/components/shared-ui/c-input";
import CotopiaSwitch from "@/components/shared-ui/c-switch";
import { PayrollCreateContract } from "@/types/payroll-create-contract";
import { useMemo } from "react";

export default function PayrollContractInputs({
  errors,
  touched,
  getFieldProps,
  setFieldValue,
  values,
  selectedUser,
}: PayrollCreateContract) {
  return (
    <>
      <CotopiaDropdown
        label='Contract type'
        items={[
          {
            title: "Per hour",
            value: "per_hour",
          },
          {
            title: "Project",
            value: "project",
          },
        ]}
        defaultValue={values?.type}
        onSelect={(item) => setFieldValue("type", item.value)}
        triggerClassName='h-10'
      />

      {/* <CotopiaInput
        {...getFieldProps("type")}
        placeholder='Enter the type'
        label='Contract type'
        type='text'
        hasError={!!touched.type && !!errors.type}
        helperText={
          touched.type && typeof errors.type === "string" ? errors.type : ""
        }
      /> */}

      <CotopiaInput
        {...getFieldProps("amount")}
        placeholder='Enter the amount'
        label='Contract amount'
        type='number'
        hasError={!!touched.amount && !!errors.amount}
        helperText={
          touched.amount && typeof errors.amount === "number"
            ? errors.amount
            : ""
        }
      />

      <CotopiaInput
        {...getFieldProps("currency")}
        placeholder='Enter the currency'
        label='Contract currency'
        type='text'
        hasError={!!touched.currency && !!errors.currency}
        helperText={
          touched.currency && typeof errors.currency === "string"
            ? errors.currency
            : ""
        }
      />

      <CotopiaInput
        {...getFieldProps("start_at")}
        placeholder='Enter the start date (YYYY-MM-DD)'
        label='Contract start at'
        type='date'
        hasError={!!touched.start_at && !!errors.start_at}
        helperText={
          touched.start_at && typeof errors.start_at === "string"
            ? errors.start_at
            : ""
        }
      />

      <CotopiaInput
        {...getFieldProps("end_at")}
        placeholder='Enter the expiration date (YYYY-MM-DD)'
        label='Contract end at'
        type='date'
        hasError={!!touched.end_at && !!errors.end_at}
        helperText={
          touched.end_at && typeof errors.end_at === "string"
            ? errors.end_at
            : ""
        }
      />

      <CotopiaSwitch
        label='Auto Renewal'
        checked={values?.auto_renewal === 1}
        onCheckedChange={(value) => {
          setFieldValue("auto_renewal", value === true ? 1 : 0);
        }}
        className='flex-col-reverse gap-y-4 [&_label]:font-bold [&_label]:text-base items-start'
      />

      {values?.auto_renewal === 1 && (
        <>
          <CotopiaInput
            {...getFieldProps("renewal_count")}
            placeholder='Enter renewal count'
            label='Renewal Count'
            type='number'
            hasError={!!touched.renewal_count && !!errors.renewal_count}
            helperText={
              touched.renewal_count && typeof errors.renewal_count === "string"
                ? errors.renewal_count
                : ""
            }
          />

          <CotopiaDropdown
            label='Renew Time Period Type'
            triggerClassName='h-10'
            items={[
              { title: "Month", value: "month" },
              { title: "Week", value: "week" },
              { title: "Day", value: "day" },
            ]}
            defaultValue={values?.renew_time_period_type}
            onSelect={(item) =>
              setFieldValue("renew_time_period_type", item.value)
            }
          />

          <CotopiaInput
            {...getFieldProps("renew_time_period")}
            placeholder='Enter renewal time period'
            label='Renew Time Period'
            type='number'
            hasError={!!touched.renew_time_period && !!errors.renew_time_period}
            helperText={
              touched.renew_time_period &&
              typeof errors.renew_time_period === "string"
                ? errors.renew_time_period
                : ""
            }
          />
          <CotopiaInput
            {...getFieldProps("renew_notice")}
            placeholder='Enter renewal notice'
            label='Renew Notice'
            type='number'
            hasError={!!touched.renew_notice && !!errors.renew_notice}
            helperText={
              touched.renew_notice && typeof errors.renew_notice === "string"
                ? errors.renew_notice
                : ""
            }
          />
        </>
      )}

      <CotopiaDropdown
        items={[
          { title: "Will renew", value: "will-renew" },
          { title: "No renew", value: "no-renew" },
        ]}
        label='User status'
        defaultValue={values?.user_status}
        onSelect={(item) => setFieldValue("user_status", item.value)}
        triggerClassName='h-10'
      />

      <CotopiaDropdown
        items={[
          { title: "Will renew", value: "will-renew" },
          { title: "No renew", value: "no-renew" },
        ]}
        label='Contractor status'
        defaultValue={values?.contractor_status}
        onSelect={(item) => setFieldValue("contractor_status", item.value)}
        triggerClassName='h-10'
      />

      <CotopiaInput
        {...getFieldProps("min_hours")}
        placeholder='Enter minimum hours'
        label='Min Hours'
        type='number'
        hasError={!!touched.min_hours && !!errors.min_hours}
        helperText={
          touched.min_hours && typeof errors.min_hours === "string"
            ? errors.min_hours
            : ""
        }
      />

      <CotopiaInput
        {...getFieldProps("max_hours")}
        placeholder='Enter maximum hours'
        label='Max Hours'
        type='number'
        hasError={!!touched.max_hours && !!errors.max_hours}
        helperText={
          touched.max_hours && typeof errors.max_hours === "string"
            ? errors.max_hours
            : ""
        }
      />

      <CotopiaDropdown
        items={[
          { title: "Cash", value: "cash" },
          { title: "TRC20", value: "trc20" },
        ]}
        defaultValue={values?.payment_method}
        onSelect={(item) => setFieldValue("payment_method", item.value)}
        label='Payment Method'
      />

      <CotopiaInput
        {...getFieldProps("payment_address")}
        placeholder='Enter payment address'
        label='Payment Address'
        type='text'
        hasError={!!touched.payment_address && !!errors.payment_address}
        helperText={
          touched.payment_address && typeof errors.payment_address === "string"
            ? errors.payment_address
            : ""
        }
      />

      <CotopiaDropdown
        items={[
          { title: "Monthly", value: "monthly" },
          { title: "Weekly", value: "weekly" },
        ]}
        defaultValue={values?.payment_period}
        onSelect={(item) => setFieldValue("payment_period", item.value)}
        label='Payment Period'
      />

      <CotopiaInput
        {...getFieldProps("role")}
        placeholder='Enter role'
        label='Role'
        type='text'
        hasError={!!touched.role && !!errors.role}
        helperText={
          touched.role && typeof errors.role === "string" ? errors.role : ""
        }
      />

      <CotopiaSwitch
        label='User Sign Status'
        checked={values?.user_sign_status === 1}
        onCheckedChange={(value) => {
          setFieldValue("user_sign_status", value === true ? 1 : 0);
        }}
        className='flex-col-reverse gap-y-4 [&_label]:font-bold [&_label]:text-base items-start'
      />

      <CotopiaSwitch
        label='Contractor Sign Status'
        checked={values?.contractor_sign_status === 1}
        onCheckedChange={(value) => {
          setFieldValue("contractor_sign_status", value === true ? 1 : 0);
        }}
        className='flex-col-reverse gap-y-4 [&_label]:font-bold [&_label]:text-base items-start'
      />
      {/* 
      <CotopiaInput
        {...getFieldProps("user_id")}
        placeholder='Enter the user id'
        label='User id'
        type='number'
        value={selectedUser?.id || ""}
        disabled
        hasError={!!touched.user_id && !!errors.user_id}
        helperText={
          touched.user_id && typeof errors.user_id === "number"
            ? errors.user_id
            : ""
        }
      /> */}
    </>
  );
}
