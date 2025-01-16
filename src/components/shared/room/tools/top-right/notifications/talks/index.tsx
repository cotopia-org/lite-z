import { useSocket } from '@/routes/private-wrarpper';
import axiosInstance from '@/services/axios';
import { TalkType } from '@/types/talk';
import { useEffect, useMemo, useState } from 'react';
import TalkItem from './talk-item';
import moment from 'moment';
import { VARZ } from '@/const/varz';

function justActiveTalks(talks: TalkType[]) {
  return talks
    .filter((a) => a.response === 'no_response' || a.response === null)
    .filter((a) => {
      const now = moment().utc();
      const created_at = moment.utc(a.created_at);
      const diffSecs = now.diff(created_at, 'seconds');

      return diffSecs < VARZ.inviteTimout;
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
          setTalks(justActiveTalks(res?.data?.data ?? []));
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
    setTalks((prev) => {
      const nTalks = [...prev];
      const findIndex = prev.findIndex((a) => a.id === data.id);

      nTalks[findIndex] = data;

      return nTalks;
    });
  });

  const handleChangeTalkItem = (talk: TalkType) => {
    //Update talk type
    setTalks((prev) => {
      const prevItems = [...prev];

      const findIndex = prevItems.findIndex((a) => a.id === talk.id);
      prevItems[findIndex] = talk;

      return prevItems;
    });
  };

  if (talks.length === 0) return null;

  return (
    <div className="talks flex flex-col gap-y-2 max-h-[600px] overflow-y-auto">
      {talks.map((talk) => (
        <TalkItem
          talk={talk}
          key={talk.id}
          onAccept={handleChangeTalkItem}
          onReject={handleChangeTalkItem}
        />
      ))}
    </div>
  );
}
