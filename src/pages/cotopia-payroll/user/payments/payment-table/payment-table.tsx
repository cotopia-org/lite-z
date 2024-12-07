import PayrollTable from "@/components/shared/cotopia-payroll/p-table";
import { useAppSelector } from "@/store";
import { PaymentsRowData, paymentType } from "@/types/payroll-table";
import { ColDef } from "ag-grid-community";
import axios from "axios";
import { useEffect, useState } from "react";

const paymentsColDefs: ColDef<PaymentsRowData>[] = [
  { headerName: "ID", field: "id", checkboxSelection: true },
  { headerName: "Total hours", field: "totalHours" },
  { headerName: "Bonus", field: "bonus" },
  { headerName: "Round", field: "round" },
  { headerName: "Amount", field: "amount" },
  { headerName: "Status", field: "status" },
];

export default function Payments() {
  const [payments, setPayments] = useState<PaymentsRowData[]>([]);
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

        console.log(data)

        const filteredData = data
          .filter((item : paymentType) => item.user.id === userData.user?.id)
          .map((item: paymentType) => ({
            id: item.id.toString(),
            totalHours: item.total_hours.sum_hours,
            amount: +item.amount.toFixed(2),
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
  }, [userData.accessToken , userData.user?.id]);

  return (
        <PayrollTable<PaymentsRowData> rowData={payments} colData={paymentsColDefs} />
  );
}
