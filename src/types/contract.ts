import { ScheduleType } from './calendar';
import { PaymentType } from './payment';

export interface UserContractType {
  amount: number;
  auto_renewal: number;
  contractor_sign_status: number;
  contractor_status: string;
  created_at: string;
  currency: string;
  end_at: string;
  id: number;
  text?: { [key: string]: string[] }[];
  max_hours: number;
  min_hours: number;
  payment_address: string;
  payment_method: string;
  payment_period: string;
  renew_notice: number;
  renew_time_period: number;
  renew_time_period_type: string;
  renewal_count: number;
  role: string;
  start_at: string;
  type: string;
  updated_at: string;
  user_id: number;
  user_sign_status: number;
  user_status: string;
  last_payment: PaymentType;
  in_schedule: 1 | 0 | boolean;
  schedule?: ScheduleType;
  content: number[];
  status:
    | 'waiting_admin_sign'
    | 'waiting_user_sign'
    | 'signed'
    | 'draft'
    | 'expired'
    | 'active';
}
