import React from 'react';
import Items from './items';
import ChatInput from './input';
import { Virtualizer } from '@tanstack/react-virtual';
import PinMessages from './pins';
import { useChat2 } from '@/hooks/chat/use-chat-2';
import { cn } from '@/lib/utils';
import { __BUS } from '@/const/bus';

type Props = {
  chat_id: number;
  addMessage?: (text: string) => void;
  onGetVirtualizer?: (vir: Virtualizer<HTMLDivElement, Element>) => void;
};

const Chat2: React.FC<Props> = ({ chat_id, addMessage, onGetVirtualizer }) => {
  const { currentChatPins } = useChat2();

  let content = (
    <div
      className={cn(
        'flex flex-col h-full  relative',
        currentChatPins ? 'pt-12' : '',
      )}
    >
      <PinMessages />
      {/* Chat message list */}
      <Items chat_id={chat_id} onGetVirtualizer={onGetVirtualizer} />
      {/* Chat input */}
    </div>
  );

  return (
    <>
      {content}
      {typeof addMessage === 'function' && (
        <ChatInput addMessage={addMessage} />
      )}
    </>
  );
};

export default Chat2;
