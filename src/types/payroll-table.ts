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
  totalHours: number;
  bonus: number;
  round: number;
  amount: number;
  status: string;
}

export interface UsersPaymentsRowData {
  id: string;
  username: string;
  avatar: AttachmentFileType;
  totalHours: number;
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
  type: string;
  contract_id: number;
  created_at: string;
  total_hours: {
    sum_minutes: number;
    idle_minutes: number;
    working_minutes: number;
    sum_hours: string;
  };
  user: {
    id: number;
    avatar: AttachmentFileType;
    name: string;
    username: string;
    status: string;
  };
}
