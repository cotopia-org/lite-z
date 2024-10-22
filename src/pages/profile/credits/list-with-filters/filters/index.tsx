import { FilterType } from "@/components/shared/filters/filter";
import FilterWithQueries from "@/components/shared/filters/filter-with-queries";
import useQuery from "@/hooks/query-params";
import { CreditStatus } from "@/types/credit";

export default function CreditsListFilters() {
  const { query } = useQuery();

  const filterItems: FilterType[] = [
    {
      name: "fullname",
      title: "نام یا کد اعتبار",
      type: "text",
    },
    {
      name: "price",
      title: "مبلغ",
      type: "number",
    },
    {
      name: "date_end",
      title: "تاریخ انقضا",
      type: "date",
    },
    {
      name: "status",
      title: "وضعیت",
      type: "radio",
      items: [
        {
          label: "فعال",
          value: CreditStatus.Active,
        },
        {
          label: "غیر فعال",
          value: CreditStatus.Disabled,
        },
      ],
    },
  ];

  return (
    <FilterWithQueries
      items={filterItems}
      defaultValue={{
        fullname: query?.fullname ?? "",
        price: query?.price ?? undefined,
        date_end: query?.date_end ?? undefined,
        status: query?.status ?? undefined,
      }}
    />
  );
}
