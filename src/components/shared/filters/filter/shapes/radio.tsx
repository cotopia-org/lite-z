import { OrgInput } from "@/components/shared-ui";
import { FilterType } from "..";
import { useFilter } from "../..";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type Props = {
  item: FilterType;
};
export default function FilterRadio({ item }: Props) {
  const { changeKey, values } = useFilter();

  const value = values?.[item?.name] ?? "";

  const filterOptions = item?.type === "radio" ? item.items : [];

  return (
    <RadioGroup
      value={value}
      onValueChange={(value) => changeKey(item.name, value)}
    >
      {filterOptions.map((x) => (
        <div key={x.value} className='flex items-center space-x-2' dir='rtl'>
          <RadioGroupItem value={"" + x.value} id={"" + x.value} />
          <Label htmlFor={"" + x.value}>{x.label}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}
