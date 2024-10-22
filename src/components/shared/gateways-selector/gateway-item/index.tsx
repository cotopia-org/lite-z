import { cn } from "@/lib/utils";
import { GatewayType } from "@/types/gateway";

type Props = {
  gateway: GatewayType;
  isSelected?: boolean;
  onSelect?: (gw: GatewayType) => void;
};
export default function Gateway({ gateway, isSelected, onSelect }: Props) {
  const iconClss = cn(
    "flex flex-col items-center justify-center rounded-xl border-4",
    isSelected ? "border-primary" : "border-black/10"
  );

  const handleSelect = () => {
    if (onSelect) onSelect(gateway);
  };

  return (
    <div
      className='flex flex-col gap-y-4 items-center cursor-pointer'
      onClick={handleSelect}
    >
      <div className={iconClss}>
        <img
          className='w-16 h-16 rounded-lg'
          src={gateway.icon.small}
          alt={gateway.name}
        />
      </div>
      <span className='text-xs font-bold text-gray-600'>{gateway.name}</span>
    </div>
  );
}
