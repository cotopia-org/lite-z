export type PaymentType = {
  amount: number;
  bonus: number;
  contract_id: number;
  id: number;
  round: number;
  status: string;
  total_hours: {
    idle_minutes: number;
    sum_hours: string;
    sum_minutes: number;
    working_minutes: number;
  };
  type: string;
  user: {
    id: number;
    name: string;
    status: string;
    username: string;
  };
};
