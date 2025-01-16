import { TalkType } from '@/types/talk';
import { createContext, ReactNode, useContext } from 'react';
import TalkItemHeader from './header';
import TalkItemActions from './actions';
import TalkItemRejectView from './reject-view';
import useAuth from '@/hooks/auth';

type Props = {
  talk: TalkType;
  onReject: (talk: TalkType) => void;
  onAccept: (talk: TalkType) => void;
};

//@ts-ignore
const TalkContext = createContext<{ talk: TalkType }>({ talk: undefined });

export const useTalk = () => useContext(TalkContext);

export default function TalkItem({ talk, onAccept, onReject }: Props) {
  const { user } = useAuth();

  let view: ReactNode = (
    <div className="flex flex-col gap-y-2 bg-white rounded-lg shadow-md p-4">
      <TalkItemHeader />
      <TalkItemActions onAccept={onAccept} onReject={onReject} />
    </div>
  );

  if (user.id === talk.owner.id) view = null;

  if (talk.response === 'rejected') view = <TalkItemRejectView />;

  return <TalkContext.Provider value={{ talk }}>{view}</TalkContext.Provider>;
}
