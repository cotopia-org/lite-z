// import { OrgInput } from "@/components/shared-ui";
import OrgDateInput from "@/components/shared-ui/o-date-input";
import { FilterType } from "..";
import { useFilter } from "../..";
import moment from "moment-jalaali";
// import { useFilter } from "../..";

type Props = {
  item: FilterType;
};
export default function FilterDate({ item }: Props) {
  const { changeKey, values } = useFilter();

  const defaultDate = values[item?.name] ?? moment();

  return (
    <OrgDateInput
      defaultDate={defaultDate}
      onSelectDate={(date) => changeKey(item.name, date)}
      variant='filled'
      type='text'
      config={{
        system: "jalali",
      }}
    />
  );
}
