import { OrgInput } from "@/components/shared-ui";
import { FilterType } from "..";
import { useFilter } from "../..";
import { persianToEnglishNumbers } from "@/lib/utils";

type Props = {
  item: FilterType;
};
export default function FilterNumber({ item }: Props) {
  const { changeKey, values } = useFilter();

  return (
    <OrgInput
      value={values?.[item.name] ?? ""}
      onChange={(e) =>
        changeKey(item.name, persianToEnglishNumbers(e.target.value))
      }
    />
  );
}
