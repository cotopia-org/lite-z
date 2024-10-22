import { DateType } from "./date";

export enum CreditStatus {
  Active = 1,
  Disabled = 2,
}

export type CreditType = {
  coupon: string;
  created_at: DateType;
  date_end_full: DateType;
  date_start_full: DateType;
  id: string;
  name: string;
  price: number;
  status: number;
};
