import * as Yup from "yup";

// Validation Schema Payments
export const validationSchemaPayments = Yup.object().shape({
  type: Yup.string()
    .required("Payment type is required.")
    .matches(
      /^[a-zA-Z0-9_\-]+$/,
      "Payment type must be a valid text and can only contain letters, numbers, underscores (_), and dashes (-)."
    ),
  bonus: Yup.number()
    .required("Payment bonus is required.")
    .typeError("Payment bonus must be a valid number."),
  total_hours: Yup.number()
    .required("Total hours are required.")
    .typeError("Total hours must be a valid number."),
});

// Initial Values payments
export const initialValuePayments = {
  type: "advance",
  status: "pending",
  bonus: 0,
  round: 0,
  total_amount: 0,
  contract_amount: 0,
  total_hours: "",
  contract_id: "",
  user_id: "",
};

// Initial Values payments
export const initialValueContract = {
  type: "per_hour",
  amount: 1,
  currency: "USDT",
  end_at: "",
  auto_renewal: 1,
  renewal_count: 1,
  renew_time_period_type: "month",
  renew_time_period: 1,
  renew_notice: 10,
  user_status: "will-renew",
  contractor_status: "will-renew",
  min_hours: 50,
  max_hours: 200,
  payment_method: "trc20",
  payment_address: "",
  payment_period: "monthly",
  role: "",
  user_sign_status: 0,
  contractor_sign_status: 0,
  user_id: "",
};

// Validation Schema Payments
export const validationSchemaContract = Yup.object().shape({
  // type: Yup.string()
  //   .required("Contract type is required.")
  //   .matches(
  //     /^[a-zA-Z0-9_\-]+$/,
  //     "Contract type must only contain letters, numbers, underscores (_), and dashes (-)."
  //   )
  //   .min(3, "Contract type must be at least 3 characters long.")
  //   .max(50, "Contract type cannot exceed 50 characters."),
  amount: Yup.number()
    .required("Amount is required.")
    .typeError("Amount must be a valid number.")
    .positive("Amount must be greater than zero.")
    .max(1000000, "Amount cannot exceed 1,000,000."),
  currency: Yup.string()
    .required("Currency is required.")
    .oneOf(
      ["USDT", "USD", "EUR"],
      "Currency must be one of the following: USDT, USD, EUR."
    ),
  end_at: Yup.date()
    .required("End date is required.")
    .min(new Date(), "End date must be in the future."),
  auto_renewal: Yup.number()
    .required("Auto-renewal status is required.")
    .oneOf([0, 1], "Auto-renewal must be either 0 (disabled) or 1 (enabled)."),
  renewal_count: Yup.number()
    .required("Renewal count is required.")
    .typeError("Renewal count must be a valid number.")
    .min(0, "Renewal count cannot be negative.")
    .max(12, "Renewal count cannot exceed 12."),
  // renew_time_period_type: Yup.string()
  //   .required("Renew time period type is required.")
  //   .oneOf(
  //     ["days", "weeks", "months"],
  //     "Renew time period type must be days, weeks, or months."
  //   ),
  renew_time_period: Yup.number()
    .required("Renew time period is required.")
    .typeError("Renew time period must be a valid number.")
    .min(1, "Renew time period must be at least 1.")
    .max(365, "Renew time period cannot exceed 365 days."),
  renew_notice: Yup.number()
    .required("Renew notice period is required.")
    .typeError("Renew notice must be a valid number.")
    .min(0, "Renew notice cannot be negative.")
    .max(30, "Renew notice cannot exceed 30 days."),
  // user_status: Yup.string()
  //   .required("User status is required.")
  //   .oneOf(
  //     ["active", "inactive", "pending"],
  //     "User status must be active, inactive, or pending."
  //   ),
  // contractor_status: Yup.string()
  //   .required("Contractor status is required.")
  //   .oneOf(
  //     ["active", "inactive", "pending"],
  //     "Contractor status must be active, inactive, or pending."
  //   ),
  min_hours: Yup.number()
    .required("Minimum hours are required.")
    .typeError("Minimum hours must be a valid number."),
  max_hours: Yup.number()
    .required("Maximum hours are required.")
    .typeError("Maximum hours must be a valid number."),
  payment_method: Yup.string()
    .required("Payment method is required.")
    .oneOf(
      ["trc20", "erc20", "paypal"],
      "Payment method must be trc20, erc20, or paypal."
    ),
  payment_period: Yup.string()
    .required("Payment period is required.")
    .oneOf(
      ["weekly", "bi-weekly", "monthly"],
      "Payment period must be weekly, bi-weekly, or monthly."
    ),
  user_sign_status: Yup.number()
    .required("User sign status is required.")
    .oneOf(
      [0, 1],
      "User sign status must be either 0 (unsigned) or 1 (signed)."
    ),
  contractor_sign_status: Yup.number()
    .required("Contractor sign status is required.")
    .oneOf(
      [0, 1],
      "Contractor sign status must be either 0 (unsigned) or 1 (signed)."
    ),
});
