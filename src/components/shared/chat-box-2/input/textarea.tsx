import { __BUS } from "@/const/bus";
import React, { useState, useRef, useEffect } from "react";
import useBus, { dispatch } from "use-bus";

type Props = {
  onChange: (value: string) => void;
  onSend: (value: string) => void;
  defaultValue?: string;
};

const MultilineTextarea: React.FC<Props> = ({
  defaultValue,
  onChange,
  onSend,
}) => {
  const [text, setText] = useState<string>("");
  useEffect(() => {
    if (defaultValue !== undefined) setText(defaultValue);
  }, [defaultValue]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; 
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Adjust height based on scroll height
    }
  }, [text]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); 
      if (onSend) onSend(text);
      setText("");
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;

    setText(value);
    onChange(value);

    const mentionIndex = value.lastIndexOf("@");
    if (mentionIndex !== -1 && (mentionIndex === 0 || value[mentionIndex - 1] === " ")) {
      dispatch(__BUS.showChatMention)
    } else {
      dispatch(__BUS.hideChatMention)
    }
  };

  useBus(__BUS.chatInputFocus, () => {
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  });

  return (
    <textarea
      ref={textareaRef}
      value={text}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      placeholder='Type your message here...'
      rows={1} // Start with one line by default
      className='outline-none w-full min-h-[32px] overflow-y-auto max-h-[100px] text-sm'
      style={{ resize: "none" }}
    />
  );
};

export default MultilineTextarea;
