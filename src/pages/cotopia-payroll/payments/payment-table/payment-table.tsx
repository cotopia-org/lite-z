import PayrollTable from "@/components/shared/cotopia-payroll/p-table";
import { useAppSelector } from "@/store";
import { PaymentsRowData, paymentType } from "@/types/payroll-table";
import { ColDef } from "ag-grid-community";
import axios from "axios";
import { useEffect, useState } from "react";

const paymentsColDefs: ColDef<PaymentsRowData>[] = [
  { headerName: "ID", field: "id", checkboxSelection: true },
  { headerName: "Date", field: "date" },
  { headerName: "Bonus", field: "bonus" },
  { headerName: "Round", field: "round" },
  { headerName: "Amount", field: "amount" },
  { headerName: "Status", field: "status" },
];

export default function Payments() {
  const [payments, setPayments] = useState<PaymentsRowData[] | null>(null);
  const userData = useAppSelector((store) => store.auth);

  useEffect(() => {
    async function fetchPayments() {
      try {
        const response = await axios.get(`${process.env.REACT_APP_PUBLIC_API_URL}/payments/`, {
          headers: {
            Authorization: `Bearer ${userData.accessToken}`,
          },
        });

        const data = response.data.data;

        const filteredData = data
          .filter((item: paymentType) => item.type !== "advance")
          .filter((item : paymentType) => item.user_id === userData.user?.id)
          .map((item: paymentType) => ({
            id: item.id.toString(),
            date: new Date(item.created_at).toLocaleDateString(),
            amount: item.amount,
            status: +item.status ? "Paid" : "Not yet",
            bonus: item.bonus || 0, 
            round: item.round || 0, 
          }));

        setPayments(filteredData);
      } catch (error) {
        console.error("Error fetching payment data:", error);
      }
    }

    fetchPayments();
  }, [userData.accessToken]);

  return (
    <>
      {payments ? (
        <PayrollTable<PaymentsRowData> rowData={payments} colData={paymentsColDefs} />
      ) : (
        <div className="w-full h-screen flex items-center justify-center">
          <h1 className="text-lg font-semibold text-gray-300">No payments yet</h1>
        </div>
      )}
    </>
  );
}
