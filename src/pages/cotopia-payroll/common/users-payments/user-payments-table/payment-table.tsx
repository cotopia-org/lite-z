import PayrollTable from "@/components/shared/cotopia-payroll/p-table";
import { useAppSelector } from "@/store";
import { UsersPaymentsRowData, paymentType } from "@/types/payroll-table";
import { ColDef } from "ag-grid-community";
import axios from "axios";
import { useEffect, useState } from "react";

const usersPaymentsColDefs: ColDef<UsersPaymentsRowData>[] = [
  { headerName: "ID", field: "id", checkboxSelection: true },
  { headerName: "Username", field: "username" },
  { headerName: "Total hours", field: "totalHours" },
  { headerName: "Date", field: "date" },
  { headerName: "Bonus", field: "bonus" },
  { headerName: "Round", field: "round" },
  { headerName: "Amount", field: "amount" },
  { headerName: "Status", field: "status" },
];

export default function UserPayments() {
  const [payments, setPayments] = useState<UsersPaymentsRowData[]>([]);
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
          .map((item: paymentType) => ({
            id: item.id.toString(),
            username: "no name",
            totalHours: item.total_hours,
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
  }, [userData.accessToken, userData.user?.id]);

  return (
    <PayrollTable<UsersPaymentsRowData> rowData={payments} colData={usersPaymentsColDefs} />
  );
}
