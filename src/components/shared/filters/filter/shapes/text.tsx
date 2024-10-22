import { OrgInput } from "@/components/shared-ui";
import { FilterType } from "..";
import { useFilter } from "../..";

type Props = {
  item: FilterType;
};
export default function FilterText({ item }: Props) {
  const { changeKey, values } = useFilter();

  return (
    <OrgInput
      value={values?.[item.name] ?? ""}
      onChange={(e) => changeKey(item.name, e.target.value)}
      dir='rtl'
    />
  );
}
