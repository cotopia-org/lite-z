import PayrollTable from "@/components/shared/cotopia-payroll/p-table";
import UserAvatar from "@/components/shared/user-avatar";
import { useAppSelector } from "@/store";
import { EmployeesRowData } from "@/types/payroll-table";
import { ColDef } from "ag-grid-community";
import axios from "axios";
import { useEffect, useState } from "react";


function Avatar({ avatarUrl, userName }: { avatarUrl: string, userName: string }) {
  return (
    <UserAvatar src={avatarUrl} title={userName} />
  );
}

const employeesColDefs: ColDef<EmployeesRowData>[] = [
  { headerName: "ID", field: "id", checkboxSelection: true },
  { headerName: "Name", field: "name" },
  { headerName: "User Name", field: "username" },
  { headerName: "User Email", field: "email" },
  {
    headerName: "User Avatar",
    field: "avatar",
    cellRenderer: (params: any) => <Avatar avatarUrl={params.value?.url} userName={params.data?.username} />,
    flex: 1,
    minWidth: 120,
  },
  { headerName: "Status", field: "status" },
  { headerName: "Last Login", field: "last_login" },
  { headerName: "Active Job", field: "active_job.title" },
  { headerName: "User Contract", field: "user_contract" },
];


export default function Employees() {
  const [employees, setEmployees] = useState<EmployeesRowData[] | null>(null);
  const userData = useAppSelector((store) => store.auth);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_PUBLIC_API_URL}/workspaces/1/users`,
          {
            headers: {
              Authorization: `Bearer ${userData.accessToken}`,
            },
          }
        );

        const data = response.data.data;

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
    <>
      {employees ? (
        <PayrollTable<EmployeesRowData> rowData={employees} colData={employeesColDefs} />
      ) : (
        <div className="w-full h-screen flex items-center justify-center">
          <h1 className="text-lg font-semibold text-gray-300">No employees yet</h1>
        </div>
      )}
    </>
  );
}

