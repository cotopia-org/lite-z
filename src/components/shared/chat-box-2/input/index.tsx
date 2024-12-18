import React, {
  FormEvent,
  FormEventHandler,
  useCallback,
  useState,
} from "react";
import EmojiHandlerButton from "./emoji";
import SendHandlerButton from "./send";
import MultilineTextarea from "./textarea";
import Mentions from "./mentions";
import { UserMinimalType } from "@/types/user";
import ReplyBox from "./reply";
import { useChat2 } from "@/hooks/chat/use-chat-2";
import EditBox from "./edit";
import { CheckIcon } from "lucide-react";

type ChatInputProps = {
  addMessage: (message: string) => void;
};

const ChatInput: React.FC<ChatInputProps> = ({ addMessage }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddMessage = useCallback(
    (value: string) => {
      setInputValue("");
      addMessage(value.trim());
    },
    [addMessage]
  );

  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleAddMessage(inputValue.trim());
    }
  };

  const handleAddEmoji = useCallback(
    (emoji: string) => setInputValue((prev) => `${prev}${emoji}`),
    []
  );

  const handleAddUserMention = useCallback(
    (value: string) =>
      setInputValue(value),
    []
  );

  const { replyMessage, editMessage } = useChat2();

  const showReplyMessage = replyMessage && !editMessage

  return (
    <div className='relative mb-2'>
      <Mentions value={inputValue} onAdd={handleAddUserMention} />
      {showReplyMessage && <ReplyBox item={replyMessage} />}
      {editMessage && <EditBox item={editMessage} />}
      <form
        onSubmit={handleSend}
        className='flex items-end space-x-2 rounded-lg px-4 py-2 bg-white'
      >
        <MultilineTextarea
          defaultValue={inputValue}
          onChange={setInputValue}
          onSend={handleAddMessage}
        />
        <div className='flex flex-row items-center'>
          <EmojiHandlerButton onPick={handleAddEmoji} />
          <SendHandlerButton text={inputValue} icon={editMessage ? <CheckIcon /> : undefined} />
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
