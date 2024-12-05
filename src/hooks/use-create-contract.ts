import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAppSelector } from "@/store";
import { FormikValues } from "formik";

interface Props {
  values : FormikValues,
  userId : number,
}

const useCreateContract = () => {
  const [loading, setLoading] = useState(false);
  const userData = useAppSelector((store) => store.auth);

  const createContract = async ({values , userId} : Props) => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_PUBLIC_API_URL}/contracts`,
        {
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
        },
        {
          headers: {
            Authorization: `Bearer ${userData.accessToken}`,
          },
        }
      );

      toast.success("Contract created successfully!");
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
