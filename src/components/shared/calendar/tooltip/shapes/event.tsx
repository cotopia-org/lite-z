import { useApi } from '@/hooks/swr';
import Tooltip, { CalendarTooltipProps } from '..';

type Props = {
  event: any;
} & Omit<CalendarTooltipProps, 'children'>;

export default function EventTooltip({ event, ...rest }: Props) {
  return <Tooltip {...rest}>{JSON.stringify(event?.metadata)}</Tooltip>;
}
