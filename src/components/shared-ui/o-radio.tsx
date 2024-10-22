import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { RadioGroupProps } from "@radix-ui/react-radio-group";
import { Label } from "../ui/label";

type Props = RadioGroupProps & {
  items: { label: string; value: string | number }[];
  label?: string;
};

export default function OrgRadio({ items, label, ...rest }: Props) {
  return (
    <div className='flex flex-col gap-y-4 w-full items-start'>
      {!!label && <span className='label text-label'>{label}</span>}
      <RadioGroup {...rest}>
        {items.map((x) => (
          <div key={x.value} className='flex items-center space-x-2' dir='rtl'>
            <RadioGroupItem value={"" + x.value} id={"" + x.value} />
            <Label htmlFor={"" + x.value}>{x.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
