import PayrollTable from "@/components/shared/cotopia-payroll/p-table";
import { useAppSelector } from "@/store";
import { EmployeesRowData } from "@/types/payroll-table";
import { fetchEmployeesData } from "@/utils/payroll";
import { ColDef } from "ag-grid-community";
import { useEffect, useState } from "react";
import MembersContract from "../user-contract";
import { TableAvatar } from "@/pages/cotopia-payroll/admin/employees/components/table-avatar";

const employeesColDefs: ColDef<EmployeesRowData>[] = [
  { headerName: "ID", field: "id", checkboxSelection: true },
  { headerName: "Name", field: "name" },
  { headerName: "User Name", field: "username" },
  { headerName: "User Email", field: "email" },
  {
    headerName: "User Avatar",
    field: "avatar",
    cellRenderer: (params: any) => <TableAvatar avatarUrl={params.value?.url} userName={params.data?.username} />,
    flex: 1,
    minWidth: 120,
  },
  { headerName: "Status", field: "status" },
  { headerName: "Last Login", field: "last_login" },
  { headerName: "Active Job", field: "active_job.title" },
  {
    headerName: "User Contract", field: "user_contract", cellRenderer: (params: { data: EmployeesRowData }) => <MembersContract userId={Number(params.data.id)} />, flex: 1,
    minWidth: 220,
  },
];

export default function Employees() {
  const [employees, setEmployees] = useState<EmployeesRowData[]>([]);
  const userData = useAppSelector((store) => store.auth);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const data = await fetchEmployeesData(userData.accessToken!)

        const normalizedData = data.map((employee: any) => ({
          id: employee.id?.toString(),
          name: employee.name || "no name",
          username: employee.username,
          email: employee.email || "No Email",
          status: employee.status,
          last_login: new Date(employee.last_login).toLocaleDateString(),
          active_job: employee.active_job || { title: "No Active Job" },
          avatar: employee.avatar,
          user_contract: "Show contract"
        }));

        setEmployees(normalizedData);
      } catch (error) {
        console.error("Error fetching employees data:", error);
      }
    }

    fetchEmployees();
  }, [userData.accessToken]);

  return (
    <PayrollTable<EmployeesRowData> rowData={employees} colData={employeesColDefs} />
  );
}

