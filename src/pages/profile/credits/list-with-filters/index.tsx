import { TableColumn } from "@/components/shared/table";
import useQuery from "@/hooks/query-params";
import TableWithPagination from "@/components/shared/table/with-pagination";
import CreditsListFilters from "./filters";
import { CreditStatus, CreditType } from "@/types/credit";
import { getJalaliDate } from "@/utils/utils";
import { cn } from "@/lib/utils";

export default function CreditsListWithFilters() {
  const { query } = useQuery();

  const columns: TableColumn<CreditType>[] = [
    {
      header: "نام کد اعتبار",
      render: (code) => <div>{code.name}</div>,
    },
    {
      header: "کد اعتبار",
      render: (code) => <div>{code.coupon}</div>,
    },
    {
      header: "مبلغ (تومان)",
      render: (code) => <div>{code.price.toLocaleString()}</div>,
    },
    {
      header: "تاریخ انقضا",
      render: (code) => <div>{getJalaliDate(code.date_end_full)}</div>,
    },
    {
      header: "تعداد استفاده",
      render: (code) => <div>{`-`}</div>,
    },
    {
      header: "وضعیت",
      render: (code) => {
        const isActive = code.status === CreditStatus.Active;

        return (
          <div className={cn(isActive ? "text-success-600" : "text-error-400")}>
            {isActive ? "فعال" : "غیر فعال"}
          </div>
        );
      },
    },
  ];

  const hasQuery = Object.keys(query).length > 0;

  let content = (
    <TableWithPagination<CreditType>
      endpoint='/credit-codes'
      columns={columns}
      className='gap-y-4'
      rowClassName='rounded-lg shadow-md'
      defaultQueries={query}
      notFoundText={
        hasQuery
          ? "کدی یافت نشد"
          : "هنوز کد اعتباری به این لیست اضافه نشده است!"
      }
    />
  );

  return (
    <div className='grid grid-cols-10 gap-2'>
      <aside className='col-span-10 md:col-span-2 shadow-md rounded-lg'>
        <CreditsListFilters />
      </aside>
      <div className='list-holder col-span-10 md:col-span-8'>{content}</div>
    </div>
  );
}
