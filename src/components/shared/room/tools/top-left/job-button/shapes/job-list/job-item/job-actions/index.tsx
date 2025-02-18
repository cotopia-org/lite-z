import { JobType } from '@/types/job';
import PlayJob from './play';
import PauseJob from './pause';
import DoneJob from './done';
import CotopiaIconButton from '@/components/shared-ui/c-icon-button';
import { colors } from '@/const/varz';
import { MessageCircle } from 'lucide-react';

type Props = {
  job: JobType;
  openChat?: () => void;
  status?: string;
};
export default function JobActions({ job, status, openChat }: Props) {
  return (
    <div className="flex flex-row gap-x-3 items-center">
      {status === 'paused' && <PlayJob job={job} />}
      {status === 'in_progress' && <PauseJob job={job} />}
      {/*<DeleteJob job={job} onDelete={onDelete} />*/}
      <DoneJob job={job} />
      <CotopiaIconButton
        onClick={() => {
          if (openChat) openChat();
        }}
        className="hover:text-black w-5 h-5"
      >
        <MessageCircle color={colors.primary.default} size={16} />
      </CotopiaIconButton>
    </div>
  );
}
