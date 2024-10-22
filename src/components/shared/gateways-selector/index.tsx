import { useApi } from "@/hooks/use-api";
import { GatewayType } from "@/types/gateway";
import Gateway from "./gateway-item";
import { useCallback, useState } from "react";
import CircularLoading from "@/components/partials/circular-loading";

type Props = {
  onSelect?: (gw: GatewayType) => void;
};

export default function GatewaySelector({ onSelect }: Props) {
  const [selected, setSelected] = useState<GatewayType>();
  const handleSelect = useCallback(
    (gateway: GatewayType) => {
      setSelected(gateway);
      if (onSelect) onSelect(gateway);
    },
    [onSelect]
  );

  const { data, isLoading } = useApi(`/gateways`);
  const gateways: GatewayType[] = data !== undefined ? data : [];

  if (isLoading || data === undefined) return <CircularLoading />;

  if (gateways.length === 0) return null;

  return (
    <div className='flex flex-row items-center gap-4 flex-wrap'>
      {gateways.map((gateway) => (
        <Gateway
          key={gateway.id}
          gateway={gateway}
          isSelected={selected?.id === gateway.id}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}
