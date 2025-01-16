import { Play } from 'lucide-react';
import { useTalk } from '../..';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { formatTime } from '@/lib/utils';
import { VARZ } from '@/const/varz';

const TimeFormat = ({ createdAt }: { createdAt: string }) => {
  const [s, setS] = useState<string>();

  const formatTimeFn = (createdAt: string): string => {
    const now = moment().utc();
    const created_at = moment.utc(createdAt);
    const diffSecs = now.diff(created_at, 'seconds');

    return formatTime(VARZ.inviteTimout - diffSecs);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setS(formatTimeFn(createdAt));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [createdAt]);

  return <span className="text-right">{s}</span>;
};

export default function TalkItemTime() {
  const { talk } = useTalk();

  return (
    <div className="flex flex-row justify-end items-center gap-x-1 font-medium text-sm text-black/70 cursor-default">
      <Play size={14} />
      <TimeFormat createdAt={talk.created_at} />
    </div>
  );
}
