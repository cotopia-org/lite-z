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

type ChatInputProps = {
  addMessage: (message: string) => void;
};

const ChatInput: React.FC<ChatInputProps> = ({ addMessage }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddMessage = useCallback((value: string) => {
    setInputValue("");
    addMessage(value.trim());
  }, []);

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
    (user: UserMinimalType) =>
      setInputValue((prev) => `${prev}${user.username} `),
    []
  );

  return (
    <div className='relative mb-2'>
      <Mentions value={inputValue} onAdd={handleAddUserMention} />
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
          <SendHandlerButton text={inputValue} />
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
