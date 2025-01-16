import { TalkType } from '@/types/talk';
import { createContext, useContext } from 'react';
import TalkItemHeader from './header';
import TalkItemActions from './actions';

type Props = {
  talk: TalkType;
  onReject: (talk: TalkType) => void;
  onAccept: (talk: TalkType) => void;
};

//@ts-ignore
const TalkContext = createContext<{ talk: TalkType }>({ talk: undefined });

export const useTalk = () => useContext(TalkContext);

export default function TalkItem({ talk, onAccept, onReject }: Props) {
  return (
    <TalkContext.Provider value={{ talk }}>
      <div className="flex flex-col gap-y-2 bg-white rounded-lg shadow-md p-4">
        <TalkItemHeader />
        <TalkItemActions onAccept={onAccept} onReject={onReject} />
      </div>
    </TalkContext.Provider>
  );
}
