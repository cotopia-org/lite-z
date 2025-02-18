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

type Props = {
  numbers: {
    passed: number;
    commitment: number;
    lost: number;
  };
};

export default function ScheduleCommitment({ numbers }: Props) {
  let passedCommitment = (
    <div className="absolute left-0 right-0 flex flex-col items-start z-[2] top-0 bottom-0 overflow-hidden">
      <CommitmentProgressBar progress={numbers.passed} variant="primary" />
    </div>
  );
  let lostCommitment = (
    <div className="absolute right-0 left-0 flex flex-col items-end top-0 bottom-0 overflow-hidden">
      <CommitmentProgressBar progress={numbers.lost} variant="error" />
    </div>
  );
  let commitment = (
    <div className="absolute left-0 right-0 z-[1] flex flex-col items-start top-0 bottom-0 overflow-hidden">
      <CommitmentProgressBar
        progress={numbers.commitment}
        variant="light"
        className="border-r-2 border-primary"
      />
    </div>
  );

  return (
    <div className="progress-bar relative bg-gray-300 rounded-3xl w-full h-[14px] overflow-hidden">
      {passedCommitment}
      {commitment}
      {lostCommitment}
    </div>
  );
}
