import { TalkType } from '@/types/talk';
import { createContext, useContext } from 'react';
import TalkItemHeader from './header';
import TalkItemActions from './actions';

type Props = {
  talk: TalkType;
};

//@ts-ignore
const TalkContext = createContext<{ talk: TalkType }>({ talk: undefined });

export const useTalk = () => useContext(TalkContext);

export default function TalkItem({ talk }: Props) {
  return (
    <TalkContext.Provider value={{ talk }}>
      <div className="flex flex-col gap-y-2 bg-white rounded-lg shadow-md p-4">
        <TalkItemHeader />
        <TalkItemActions />
      </div>
    </TalkContext.Provider>
  );
}
