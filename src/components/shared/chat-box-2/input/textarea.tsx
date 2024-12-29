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
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null);
  const [showMentionBox, setShowMentionBox] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Set default value on load
  useEffect(() => {
    if (defaultValue !== undefined) setText(defaultValue);
  }, [defaultValue]);

  // Auto-resize the textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  // Handle keyboard events (e.g., Enter key)
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {

    if (showMentionBox) return

    if (event.key === "Enter" && !event.shiftKey ) {
      event.preventDefault(); // Prevent newline
      if (onSend) onSend(text);
      setText("");
      setShowMentionBox(false); // Hide mention box
    }
  };

  // Handle text input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setText(value);
    onChange(value);

    // Detect mentions
    const words = value.split(/\s+/);
    const lastWord = words[words.length - 1];

    if (lastWord.startsWith("@")) {
      const mentionIndex = value.lastIndexOf(lastWord);
      const selectionStart = event.target.selectionStart;

      // Calculate cursor position for the mention box
      const textBeforeCaret = value.slice(0, selectionStart);
      const lines = textBeforeCaret.split("\n");
      const line = lines[lines.length - 1];
      const charIndex = line.length;

      if (textareaRef.current) {
        const { offsetLeft, offsetTop, clientHeight } = textareaRef.current;
        const x = offsetLeft + charIndex * 8; // Approximate character width
        const y = offsetTop + clientHeight;
        setCursorPosition({ x, y });
      }

      setShowMentionBox(true);
      dispatch(__BUS.showChatMention);
    } else {
      setShowMentionBox(false);
      dispatch(__BUS.hideChatMention);
    }
  };

  useBus(__BUS.hideChatMention, () => {
    setShowMentionBox(false)
  })

  // Focus on the input when triggered
  useBus(__BUS.chatInputFocus, () => {
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  });

  return (
    <div className="relative w-full">      
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message here..."
        rows={1}
        className="outline-none w-full min-h-[24px] overflow-y-auto max-h-[24px] text-sm"
        style={{ resize: "none" }}
      />
    </div>
  );
};

export default MultilineTextarea;
