import { useSocket } from '@/routes/private-wrarpper';
import axiosInstance from '@/services/axios';
import { TalkType } from '@/types/talk';
import { useEffect, useMemo, useState } from 'react';
import TalkItem from './talk-item';
import moment from 'moment';

const fiv_mins = 60 * 5;

function justActiveTalks(talks: TalkType[]) {
  return talks
    .filter((a) => a.response === 'no_response' || a.response === null)
    .filter((a) => {
      const now = moment().utc();
      const created_at = moment.utc(a.created_at);
      const diffSecs = now.diff(created_at, 'seconds');

      console.log('diffSecs', diffSecs);

      return diffSecs < fiv_mins;
    });
}

export default function Talks() {
  const [talks, setTalks] = useState<TalkType[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTalks(justActiveTalks(talks));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [talks]);

  useEffect(() => {
    async function getUserTalks() {
      axiosInstance
        .get(`/users/talks`)
        .then((res) => {
          setTalks(res?.data?.data ?? []);
        })
        .catch((err) => {});
    }
    getUserTalks();
  }, []);

  useSocket('talkCreated', (data) => {
    console.log('talkCreated data', data);
    setTalks((prev) => [...prev, data]);
  });

  useSocket('talkResponded', (data) => {
    console.log('talkResponded data', data);
  });

  if (talks.length === 0) return null;

  return (
    <div className="talks flex flex-col gap-y-2 max-h-[600px] overflow-y-auto">
      {talks.map((talk) => (
        <TalkItem talk={talk} key={talk.id} />
      ))}
    </div>
  );
}
