import { UserMinimalType } from './user';
import { UserContractType } from "@/types/contract";
import {
  FieldConfig,
  FieldInputProps,
  FormikErrors,
  FormikTouched,
  FormikValues,
} from "formik";

export interface PayrollCreateContract {
  getFieldProps: (
    nameOrOptions: string | FieldConfig<any>
  ) => FieldInputProps<any>;
  errors: FormikErrors<FormikValues>;
  touched: FormikTouched<FormikValues>;
  userContract?: UserContractType | null;
  values?: FormikValues;
  selectedUser? : UserMinimalType;
}
