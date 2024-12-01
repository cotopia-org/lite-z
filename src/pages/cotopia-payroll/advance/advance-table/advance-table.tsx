import PayrollTable from "@/components/shared/cotopia-payroll/p-table";
import { useAppSelector } from "@/store";
import { AdvanceRowData, paymentType } from "@/types/payroll-table";
import { ColDef } from "ag-grid-community";
import axios from "axios";
import { useEffect, useState } from "react";

const advanceColDefs: ColDef<AdvanceRowData>[] = [
  { headerName: "ID", field: "id", checkboxSelection: true },
  { headerName: "Date", field: "date" },
  { headerName: "Reason", field: "reason" },
  { headerName: "Amount", field: "amount" },
  { headerName: "Status", field: "status" },
];

export default function AdvanceRequest() {
  const [advance, setAdvance] = useState<AdvanceRowData[]>([]);
  const userData = useAppSelector((store) => store.auth);

  useEffect(() => {
    async function fetchAdvance() {
      try {
        const response = await axios.get(`${process.env.REACT_APP_PUBLIC_API_URL}/payments/`, {
          headers: {
            Authorization: `Bearer ${userData.accessToken}`,
          },
        });

        const data = response.data.data;

        const filteredData = data
          .filter((item: paymentType) => item.type === "advance")
          .filter((item : paymentType) => item.user_id === userData.user?.id)
          .map((item: paymentType) => ({
            id: item.id.toString(),
            date: new Date(item.created_at).toLocaleDateString(),
            amount: item.amount,
            status: item.status,
          }));

        setAdvance(filteredData);
      } catch (error) {
        console.error("Error fetching advance data:", error);
      }
    }

    fetchAdvance();
  }, [userData.accessToken , userData.user?.id]);

  return (
        <PayrollTable<AdvanceRowData> rowData={advance} colData={advanceColDefs} />
  );
};