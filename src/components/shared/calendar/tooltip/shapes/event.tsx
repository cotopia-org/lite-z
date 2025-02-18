import { useApi } from '@/hooks/swr';
import Tooltip, { CalendarTooltipProps } from '..';

type Props = {
  event: any;
} & Omit<CalendarTooltipProps, 'children'>;

export default function EventTooltip({ event, ...rest }: Props) {
  const { id } = event?.metadata ?? {};

  const { isLoading, data } = useApi(`/availabilities/${id}`);

  return <Tooltip {...rest}>{JSON.stringify(data)}</Tooltip>;
}
