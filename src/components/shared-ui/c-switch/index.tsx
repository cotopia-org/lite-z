import { v4 as uuidv4 } from "uuid";

import { Switch } from "@/components/ui/switch";
import { SwitchProps } from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

type Props = SwitchProps & { label?: string };

export default function CotopiaSwitch({ label, className, ...rest }: Props) {
  const switchId = rest?.id ?? uuidv4();

  return (
    <div className={cn("flex flex-row items-center gap-x-4", className)}>
      <Switch id={switchId} {...rest} />
      <label className='cursor-pointer text-sm' htmlFor={switchId}>
        {label}
      </label>
    </div>
  );
}
