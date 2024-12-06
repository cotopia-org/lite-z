import PayrollTable from "@/components/shared/cotopia-payroll/p-table";
import { TableAvatar } from "@/pages/cotopia-payroll/admin/employees/components/table-avatar";
import { useAppSelector } from "@/store";
import { UsersPaymentsRowData, paymentType } from "@/types/payroll-table";
import { UserType } from "@/types/user";
import { fetchEmployeesData } from "@/utils/payroll";
import { ColDef } from "ag-grid-community";
import axios from "axios";
import { useEffect, useState } from "react";

const usersPaymentsColDefs: ColDef<UsersPaymentsRowData>[] = [
  { headerName: "ID", field: "id", checkboxSelection: true },
  { headerName: "Username", field: "username" },
  {
    headerName: "User Avatar",
    field: "avatar",
    cellRenderer: (params: any) => <TableAvatar avatarUrl={params.value?.url} userName={params.data?.username} />,
    flex: 1,
    minWidth: 120,
  }, { headerName: "Total hours", field: "totalHours" },
  { headerName: "Date", field: "date" },
  { headerName: "Bonus", field: "bonus" },
  { headerName: "Round", field: "round" },
  { headerName: "Amount", field: "amount" },
  { headerName: "Status", field: "status" },
];

export default function UsersPayments() {
  const [payments, setPayments] = useState<UsersPaymentsRowData[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const userData = useAppSelector((store) => store.auth);


  useEffect(() => {
    async function fetchUsers() {
      const users = await fetchEmployeesData(userData.accessToken!);
      setUsers(users);
    }

    fetchUsers();
  }, [userData.accessToken, userData.user?.id]);


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
            username: users.find((user: UserType) => user.id === item.user_id)?.username || "Loading...",
            avatar: users.find((user: UserType) => user.id === item.user_id)?.avatar || "Loading...",
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
  }, [userData.accessToken, users]);

  return (
    <PayrollTable<UsersPaymentsRowData> rowData={payments} colData={usersPaymentsColDefs} />
  );
}
