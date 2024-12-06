import { JobType } from "./job";
import { AttachmentFileType } from "./file";

export interface AdvanceRowData {
  id: string;
  date: string;
  reason: string;
  amount: number;
  status: string;
}

export interface PaymentsRowData {
  id: string;
  date: string;
  totalHours: number;
  bonus: number;
  round: number;
  amount: number;
  status: string;
}

export interface UsersPaymentsRowData {
  id: string;
  username: string;
  totalHours: number;
  date: string;
  bonus: number;
  round: number;
  amount: number;
  status: string;
}

export interface EmployeesRowData {
  id: string;
  name: string;
  username: string;
  status: string;
  active_job: JobType;
  email: string;
  last_login: string;
  avatar: AttachmentFileType;
  user_contract: string;
}

export interface paymentType extends AdvanceRowData {
  bonus: number;
  round: number;
  total_hours: number;
  type: string;
  user_id: number;
  contract_id: number;
  created_at: string;
}
