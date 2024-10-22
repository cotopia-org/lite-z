import TableWithPagination from "@/components/shared/table/with-pagination";
import PersonnelViewWithFilters from "./personnel-view-with-filters";
import { urlWithQueryParams } from "@/lib/utils";
import { PersonType } from "@/types/person";
import { TableColumn } from "@/components/shared/table";

type Props = {
  person: PersonType;
};
export default function List({ person }: Props) {
  const columns: TableColumn<any>[] = [
    {
      header: "نام یا کد اعتبار",
      render: (item) => <>-</>,
    },
    {
      header: "مبلغ (تومان)",
      render: (item) => <>-</>,
    },
    {
      header: "کد ملی",
      render: (item) => <>-</>,
    },
  ];

  return (
    <div className='grid grid-cols-10 gap-2'>
      <aside className='col-span-10 md:col-span-2 shadow-md rounded-lg'>
        <PersonnelViewWithFilters />
      </aside>
      <div className='list-holder col-span-10 md:col-span-8'>
        <TableWithPagination<any>
          endpoint={urlWithQueryParams(`/credit-codes`, {
            national_code: person.national_code,
          })}
          columns={[]}
          className='gap-y-4'
          rowClassName='rounded-lg shadow-md'
        />
      </div>
    </div>
  );
}
