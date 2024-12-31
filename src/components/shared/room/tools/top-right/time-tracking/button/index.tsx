import Timer from '../timer';
import ToolButton from '../../../tool-button';
import { ClockIcon } from '@/components/icons';
import { VARZ } from '@/const/varz';
import { cn } from '@/lib/utils';
import useAuth from '@/hooks/auth';

type Props = {
  isLoading: boolean;
  onClick: () => void;
  isOpen: boolean;
  defaultSeconds: number;
  stop: boolean;
};

export default function TimeTrackingButton({
  isLoading,
  onClick,
  isOpen,
  defaultSeconds,
  stop,
}: Props) {
  const { user } = useAuth();

  return (
    <ToolButton
      isOpen={isOpen}
      open={onClick}
      startIcon={<ClockIcon size={20} />}
      className="!min-w-[135px] !px-2"
      loading={isLoading}
    >
      {user.active_contract !== null ? (
        <div>
          {!stop && (
            <div className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
          )}
          <Timer
            initialSeconds={defaultSeconds}
            stop={stop}
            id={VARZ.userTimeTrackerId}
            defaultStatus={stop ? 'stopped' : 'normal'}
          >
            {(time) => (
              <span className={cn('min-w-[60px]', stop ? 'text-red-500' : '')}>
                {time}
              </span>
            )}
          </Timer>
        </div>
      ) : (
        <div>
          <p className={'text-red-500'}>You have no active contract!</p>
        </div>
      )}
    </ToolButton>
  );
}
