import React from "react";

export interface TableColumn<T> {
  header: string;
  accessor?: keyof T;
  render?: (item: T) => React.ReactNode;
}

export interface TableProps<T> {
  items: T[];
  onRowItemClick?: (item: T) => void;
  columns: TableColumn<T>[];
  className?: string;
  rowClassName?: string;
}

export const Table = <T extends {}>({
  className,
  items,
  columns,
  rowClassName,
  onRowItemClick,
}: TableProps<T>) => {
  return (
    <div className={`w-full flex flex-col ${className ?? ""}`}>
      {/* Table Header */}
      <div className='flex bg-primary-200 rounded-lg shadow-md text-gray-800 font-semibold'>
        {columns.map((column, index) => (
          <div
            key={index}
            className='flex-1 py-4 px-2 text-center font-medium text-label'
          >
            {column.header}
          </div>
        ))}
      </div>

      {/* Table Rows */}
      <div className='flex flex-col'>
        {items.map((item, rowIndex) => (
          <div
            key={rowIndex}
            className={`flex w-full ${
              rowClassName ? rowClassName : "even:bg-gray-50 odd:bg-white"
            }`}
          >
            {columns.map((column, colIndex) => (
              <div
                key={colIndex}
                className='flex-1 py-4 px-2 text-center cursor-pointer'
                onClick={() => {
                  if (onRowItemClick && typeof onRowItemClick === "function")
                    onRowItemClick(item);
                }}
              >
                {column.render
                  ? column.render(item)
                  : (item[column.accessor!] as React.ReactNode)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
