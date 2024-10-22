import { useCallback, useEffect, useState } from "react";
import { OrgButton } from "../shared-ui";
import Amount from "./amount";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

type Props = {
  items: number[];
  onSelect: (amount: number) => void;
  defaultAmount?: number;
};

export default function AmountSelector({
  items = [],
  onSelect,
  defaultAmount,
}: Props) {
  const [selected, setSelected] = useState<number>();
  useEffect(() => {
    if (defaultAmount !== undefined) setSelected(defaultAmount);
  }, [defaultAmount]);
  const handleSelect = useCallback(
    (amount: number) => {
      if (onSelect) onSelect(amount);
      setSelected(amount);
    },
    [onSelect]
  );

  return (
    <div className='grid grid-cols-12 gap-4'>
      {items.map((amount) => {
        const isSelected = amount === selected;

        return (
          <div className='col-span-12 md:col-span-6 lg:col-span-4' key={amount}>
            <div
              className={buttonVariants({
                variant: isSelected ? "default" : "outline",
                class: cn(
                  "w-full cursor-pointer h-[64px]",
                  isSelected
                    ? "bg-primary-200 border border-primary [&_.amount]:text-primary"
                    : ""
                ),
              })}
              onClick={() => handleSelect(amount)}
            >
              <Amount value={amount} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
