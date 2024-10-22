import { FilterType } from ".";
import FilterDate from "./shapes/date";
import FilterNumber from "./shapes/number";
import FilterRadio from "./shapes/radio";
import FilterText from "./shapes/text";

type Props = {
  filter: FilterType;
};
export default function FilterRenderer({ filter }: Props) {
  switch (filter.type) {
    case "text":
      return <FilterText item={filter} />;
    case "date":
      return <FilterDate item={filter} />;
    case "number":
      return <FilterNumber item={filter} />;
    case "radio":
      return <FilterRadio item={filter} />;
    default:
      return <>Nothing!</>;
  }
}
