import { OrgButton } from "@/components/shared-ui";
import Filter, { FilterType } from "./filter";
import { createContext, useContext, useEffect } from "react";
import { useValues } from "@/hooks";

type ValueType = { [key: string]: any };

export type FitlersProps = {
  items: FilterType[];
  title?: string;
  onSearch?: (values: ValueType) => void;
  defaultValue?: ValueType;
};

const FiltersContext = createContext<{
  values: ValueType;
  changeKey: (key: string, value: any) => void;
}>({
  values: {},
  changeKey: (key, value) => {},
});

export const useFilter = () => useContext(FiltersContext);

export default function Filters({
  items = [],
  title = "فیلتر‌ها",
  onSearch,
  defaultValue,
}: FitlersProps) {
  const { values, changeKey, changeBulk } = useValues<ValueType>(
    defaultValue ?? {}
  );

  const handleSearch = () => {
    if (onSearch) onSearch(values);
  };

  const handleResetFilters = () => {
    const nValues = items
      .map((x) => x.name)
      .reduce((a, v) => ({ ...a, [v]: undefined }), {});
    changeBulk(nValues);
    if (onSearch) onSearch(nValues);
  };

  return (
    <FiltersContext.Provider value={{ values, changeKey }}>
      <div className='flex flex-col w-full justify-between h-full'>
        <div className='flex flex-col'>
          <div className='flex flex-row items-center justify-between p-4 border-b'>
            <strong className='text-lg text-label font-normal'>{title}</strong>
            <div>
              <OrgButton variant={"link"} onClick={handleResetFilters}>
                حذف فیلتر‌ها
              </OrgButton>
            </div>
          </div>
          <div className='filter-items flex flex-col'>
            {items.map((x, key) => (
              <Filter key={`${key}-${x.name}`} item={x} />
            ))}
          </div>
        </div>
        {!!onSearch && (
          <div className='p-4'>
            <OrgButton onClick={handleSearch}>اعمال فیلتر</OrgButton>
          </div>
        )}
      </div>
    </FiltersContext.Provider>
  );
}
