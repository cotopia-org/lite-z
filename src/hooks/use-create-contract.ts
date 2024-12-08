import { useState } from "react";
import { toast } from "sonner";
import { FormikValues } from "formik";
import { useRoomContext } from "@/components/shared/room/room-context";
import axiosInstance from "@/services/axios";
import { usePayroll } from "@/pages/cotopia-payroll/user/payroll";

interface Props {
  values: FormikValues;
  userId: number;
}

const useCreateContract = () => {
  const { workspace_id } = useRoomContext();

  const { changePage } = usePayroll();

  const [loading, setLoading] = useState(false);

  const createContract = async ({ values, userId }: Props) => {
    setLoading(true);

    try {
      const response = await axiosInstance.post(`/contracts`, {
        type: values.type,
        amount: +values.amount,
        currency: values.currency,
        start_at: new Date().toISOString(),
        end_at: new Date(values.end_at).toISOString(),
        auto_renewal: values.auto_renewal,
        renewal_count: values.renewal_count,
        renew_time_period_type: values.renew_time_period_type,
        renew_time_period: +values.renew_time_period,
        renew_notice: +values.renew_notice,
        user_status: values.user_status,
        contractor_status: values.contractor_status,
        min_hours: +values.min_hours,
        max_hours: +values.max_hours,
        payment_method: values.payment_method,
        payment_address: values.payment_address,
        payment_period: values.payment_period,
        role: values.role,
        user_sign_status: +values.user_sign_status,
        contractor_sign_status: +values.contractor_sign_status,
        user_id: userId,
        workspace_id,
      });

      toast.success("Contract created successfully!");

      changePage("all-members");
    } catch (error) {
      console.error("Error creating payments:", error);
      toast.error("There was an error creating the Contract!");
    } finally {
      setLoading(false);
    }
  };

  return { createContract, loading };
};

export default useCreateContract;
