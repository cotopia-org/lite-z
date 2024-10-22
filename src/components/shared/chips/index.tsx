import { OrgButton } from "@/components/shared-ui";
import { Ellipsis, X } from "lucide-react";
import { useState } from "react";

type Props = {
  items: { label: string; value: string }[];
  onRemove: (value: string) => void;
  limitShow?: number;
};
export default function Chips({ items = [], onRemove, limitShow = 10 }: Props) {
  const [isExpand, setIsExpand] = useState(false);

  if (items.length === 0) return null;

  const isOverLimit = items.length > limitShow;

  let finalItems = isOverLimit ? items.slice(0, limitShow) : items;

  if (isExpand) finalItems = items;

  return (
    <div className='flex flex-row flex-wrap gap-2 w-full'>
      {finalItems.map((item) => (
        <OrgButton
          key={item.value}
          variant={"outline"}
          className='w-auto border-label text-label !rounded-full'
          endIcon={<X />}
          onClick={() => onRemove(item.value)}
        >
          {item.label}
        </OrgButton>
      ))}
      {isOverLimit && (
        <OrgButton
          variant={"outline"}
          onClick={() => setIsExpand((prev) => !prev)}
          className='w-auto rounded-full border-label text-label'
          type='button'
        >
          {isExpand ? <X /> : <Ellipsis />}
        </OrgButton>
      )}
    </div>
  );
}
