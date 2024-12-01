import React from "react";
import Items from "./items";
import ChatInput from "./input";
import { Virtualizer } from "@tanstack/react-virtual";
import PinMessages from "./pins";

type Props = {
  chat_id: number;
  addMessage?: (text: string) => void;
  onGetVirtualizer?: (vir: Virtualizer<HTMLDivElement, Element>) => void;
};

const Chat2: React.FC<Props> = ({ chat_id, addMessage, onGetVirtualizer }) => {
  let content = (
    <div className='flex flex-col h-full bg-black/[.04] relative'>
      <PinMessages />
      {/* Chat message list */}
      <Items
        chat_id={chat_id}
        marginFetching={300}
        onGetVirtualizer={onGetVirtualizer}
      />
      {/* Chat input */}
    </div>
  );

  return (
    <>
      {content}
      {typeof addMessage === "function" && (
        <ChatInput addMessage={addMessage} />
      )}
    </>
  );
};

export default Chat2;
