import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ColDef } from 'ag-grid-community';

interface Props<T> {
    rowData: T[];
    colData: ColDef<T>[];
}

export default function PayrollTable<T>({ rowData, colData }: Props<T>) {
    return (
        <div
            className="ag-theme-quartz-dark p-4"
            style={{ height: '100%', width: '100%' }}
        >
            <AgGridReact
                rowData={rowData}
                columnDefs={colData}
                rowSelection="single"
                paginationPageSize={10}
                pagination={true}
                suppressHorizontalScroll={false}
            />
        </div>
    );
}