import { Table, TableColumn } from "@/components/shared/table";
import { Gender, PersonType } from "@/types/person";
import PersonnelListFilters from "./filters";
import useQuery from "@/hooks/query-params";
import TableWithPagination from "@/components/shared/table/with-pagination";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export default function PersonnelListWithFilters() {
  const navigate = useNavigate();
  const handleRowClicked = useCallback((item: PersonType) => {
    navigate(`/profile/personnel/${item.id}`);
  }, []);

  const { query } = useQuery();

  const columns: TableColumn<PersonType>[] = [
    {
      header: "نام پرسنل",
      render: (person) => <div>{person.fullname}</div>,
    },
    {
      header: "جنسیت",
      render: (person) => (
        <div>{person.gender === Gender.Male ? "مرد" : "زن"}</div>
      ),
    },
    {
      header: "کد ملی",
      render: (person) => <div>{person.national_code}</div>,
    },
    {
      header: "شماره تماس",
      render: (person) => <div>{person.mobile}</div>,
    },
    {
      header: "تعداد استفاده از کدهای اعتبار",
      render: (person) => <div>{"-"}</div>,
    },
  ];

  const hasQuery = Object.keys(query).length > 0;

  let content = (
    <TableWithPagination<PersonType>
      endpoint='/person'
      columns={columns}
      className='gap-y-4'
      rowClassName='rounded-lg shadow-md'
      defaultQueries={query}
      notFoundText={
        hasQuery ? "شخصی یافت نشد!" : "هنوز شخصی به این لیست اضافه نشده است!"
      }
      onRowItemClick={handleRowClicked}
    />
  );

  return (
    <div className='grid grid-cols-10 gap-2'>
      <aside className='col-span-10 md:col-span-3 lg:col-span-2 shadow-md rounded-lg'>
        <PersonnelListFilters />
      </aside>
      <div className='list-holder col-span-10 md:col-span-7 lg:col-span-8'>
        {content}
      </div>
    </div>
  );
}
