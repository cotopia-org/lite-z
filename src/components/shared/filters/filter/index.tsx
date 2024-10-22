import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import FilterRenderer from "./renderer";

export type FilterTextType = {
  type: "text";
};

export type FilterNumberType = {
  type: "number";
};

export type FilterRadioType = {
  type: "radio";
  items: { label: string; value: string | number }[];
};

export type FilterSliderType = {
  type: "slider";
};

export type FilterDateType = {
  type: "date";
};

export type FilterType = {
  title: string;
  name: string;
} & (
  | FilterTextType
  | FilterRadioType
  | FilterSliderType
  | FilterNumberType
  | FilterDateType
);

type Props = {
  item: FilterType;
};

export default function Filter({ item }: Props) {
  const [isExpand, setIsExpand] = useState(false);
  const toggleExpand = () => setIsExpand((prev) => !prev);

  return (
    <div className='flex flex-col filter border-b last:border-0'>
      <div
        className='flex flex-row items-center justify-between p-4  cursor-pointer'
        onClick={toggleExpand}
      >
        <span className='text-base font-normal text-label'>{item.title}</span>
        <div>{isExpand ? <ChevronUp /> : <ChevronDown />}</div>
      </div>
      {isExpand && (
        <div className='filter-options p-4 pt-0'>
          <FilterRenderer filter={item} />
        </div>
      )}
    </div>
  );
}
