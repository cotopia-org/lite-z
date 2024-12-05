import axios from "axios";
import { toast } from "sonner";
import useAuth from "./auth";
import { useState } from "react";

interface CreatePaymentProps {
  status: string;
  amount: number;
  bonus: number;
  round: number;
  total_hours: number;
  user_id: number;
  contract_id: number;
  type: string;
}

export function useCreatePayment() {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const createPayment = async (paymentData: CreatePaymentProps) => {
    try {
      setLoading(true);
      await axios.post(
        `${process.env.REACT_APP_PUBLIC_API_URL}/payments`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Payments created successfully!");
    } catch (error) {
      console.error("Error creating payments:", error);
      toast.error("There was an error creating the payments!");
    } finally {
      setLoading(false); 
    }
  };

  return { createPayment, loading };
}
