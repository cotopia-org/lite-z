import { FilterType } from "@/components/shared/filters/filter";
import FilterWithQueries from "@/components/shared/filters/filter-with-queries";
import useQuery from "@/hooks/query-params";

export default function PersonnelViewWithFilters() {
  const { query } = useQuery();

  const filterItems: FilterType[] = [
    {
      name: "coupon",
      title: "نام یا کد اعتبار",
      type: "text",
    },
    {
      name: "price",
      title: "مبلغ",
      type: "number",
    },
  ];

  return (
    <FilterWithQueries
      items={filterItems}
      defaultValue={{
        coupon: query?.coupon ?? "",
        price: query?.price ?? undefined,
      }}
    />
  );
}
