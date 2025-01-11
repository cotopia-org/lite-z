import { BellOff, UsersRound } from 'lucide-react';
import { ReactNode } from 'react';

type Props = {
  title: string;
  sub_title?: string;
  date?: string;
  description?: ReactNode;
  type: string;
  muted: number;
};
export default function ChatDetails({
  title,
  sub_title,
  date,
  description,
  type,
  muted,
}: Props) {
  return (
    <div className="flex flex-col gap-y-1 flex-1 w-full">
      <div className="flex flex-row justify-between items-center  w-full">
        <div className="flex flex-col justify-between">
          <div className={'flex flex-row items-center gap-1'}>
            <strong className={'text-sm'}>{title}</strong>
            {type !== 'direct' && <UsersRound size={16} color={'black'} />}
            {muted === 1 && <BellOff size={16} />}
          </div>

          {!!sub_title && (
            <span className="text-xs text-gray-500">{sub_title}</span>
          )}
        </div>

        {!!date && (
          <div>
            <span className="text-xs text-gray-500">{date}</span>
          </div>
        )}
      </div>

      {!!description && (
        <span className="text-sm text-gray-500 text-ellipsis whitespace-nowrap overflow-hidden w-[300px]">
          {description}
        </span>
      )}
    </div>
  );
}
