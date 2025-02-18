import { cn } from '@/lib/utils';

function CommitmentProgressBar({
  progress,
  variant,
  className,
}: {
  progress: number;
  variant: 'primary' | 'light' | 'error';
  className?: string;
}) {
  let clss = 'h-full';

  switch (variant) {
    case 'error':
      clss = cn(clss, 'bg-error');
      break;
    case 'light':
      clss = cn(clss, 'bg-primary-light');
      break;
    case 'primary':
      clss = cn(clss, 'bg-primary');
      break;
  }

  clss = cn(clss, className);

  return (
    <div
      style={{
        width: `${progress}%`,
      }}
      className={clss}
    ></div>
  );
}

function Label({
  label,
  variant,
  className,
}: {
  label: string;
  variant: 'primary' | 'light' | 'error';
  className?: string;
}) {
  let clss = 'h-full flex flex-row items-center gap-x-1';
  switch (variant) {
    case 'error':
      clss = cn(clss, 'text-error [&_.circle]:bg-error');
      break;
    case 'light':
      clss = cn(
        clss,
        'text-grayscale-paragraph [&_.circle]:bg-grayscale-paragraph',
      );
      break;
    case 'primary':
      clss = cn(clss, 'text-primary [&_.circle]:bg-primary');
      break;
  }

  if (className) clss = cn(clss, className);

  return (
    <div className={clss}>
      <div className="w-2 h-2 rounded-full circle"></div>
      <strong className="text-sm font-normal">{label}</strong>
    </div>
  );
}

type Props = {
  numbers: {
    passed: number;
    commitment: number;
    remaining: number;
    lost: number;
  };
  times: {
    attended: string;
    remaining: string;
    missed: string;
  };
};

export default function ScheduleCommitment({ numbers, times }: Props) {
  let passedCommitment = (
    <div className="absolute left-0 right-0 flex flex-col items-start z-[2] top-0 bottom-0 overflow-hidden">
      <CommitmentProgressBar progress={numbers.passed} variant="primary" />
    </div>
  );
  let lostCommitment = (
    <div className="absolute right-0 left-0 z-[2] flex flex-col items-end top-0 bottom-0 overflow-hidden">
      <CommitmentProgressBar progress={numbers.lost} variant="error" />
    </div>
  );
  let commitment = (
    <div className="absolute left-0 right-0 z-[1] flex flex-col items-start top-0 bottom-0 overflow-hidden">
      <CommitmentProgressBar progress={numbers.remaining} variant="light" />
    </div>
  );
  let commitmentDivider = (
    <div
      style={{
        left: `${numbers.commitment}%`,
      }}
      className="absolute left-0 right-0 z-[4] flex flex-col items-start top-0 bottom-0 overflow-hidden"
    >
      <div className="w-1 h-full bg-primary"></div>
    </div>
  );

  return (
    <div className="flex flex-col gap-y-2">
      <div className="progress-bar relative bg-gray-300 rounded-3xl w-full h-[14px] overflow-hidden">
        {passedCommitment}
        {commitment}
        {commitmentDivider}
        {lostCommitment}
      </div>
      <div className="flex flex-row items-center justify-between">
        <div>
          <Label label={`Attended: ${times.attended}`} variant="primary" />
        </div>
        <div>
          <Label label={`Remaining: ${times.remaining}`} variant="light" />
        </div>
        <div>
          <Label label={`Missed: ${times.missed}`} variant="error" />
        </div>
      </div>
    </div>
  );
}
