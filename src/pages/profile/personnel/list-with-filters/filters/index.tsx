import { FilterType } from "@/components/shared/filters/filter";
import FilterWithQueries from "@/components/shared/filters/filter-with-queries";
import useQuery from "@/hooks/query-params";
import { Gender } from "@/types/person";

export default function PersonnelListFilters() {
  const { query } = useQuery();

  const filterItems: FilterType[] = [
    {
      name: "fullname",
      title: "نام پرسنل",
      type: "text",
    },
    {
      name: "gender",
      title: "جنسیت",
      type: "radio",
      items: [
        { label: "مرد", value: Gender.Male },
        { label: "زن", value: Gender.FeMale },
      ],
    },
    {
      name: "national_code",
      title: "کد ملی",
      type: "number",
    },
    {
      name: "mobile",
      title: "شماره تماس",
      type: "number",
    },
  ];

  return (
    <FilterWithQueries
      items={filterItems}
      defaultValue={{
        fullname: query?.fullname ?? "",
        gender: query?.gender ?? undefined,
        mobile: query?.mobile ?? undefined,
        national_code: query?.national_code ?? undefined,
      }}
    />
  );
}
