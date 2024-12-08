import axios from "axios";
import { toast } from "sonner";
import useAuth from "./auth";
import { useState } from "react";
import axiosInstance from "@/services/axios";

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
      await axiosInstance.post(`/payments`, paymentData);
      toast.success("Payments created successfully!");
    } catch (error) {
      console.error("Error creating payments:", error);
      toast.error("There was an error creating the payments!");
    } finally {
      setLoading(false);
    }
  };

  const updatePayment = async (id: number, paymentData: CreatePaymentProps) => {
    try {
      setLoading(true);
      await axiosInstance.put(`/payments/${id}`, paymentData);
      toast.success("Payments updated successfully!");
    } catch (error) {
      console.error("Error updating payments:", error);
      toast.error("There was an error updating the payments!");
    } finally {
      setLoading(false);
    }
  };

  return { updatePayment, createPayment, loading };
}
