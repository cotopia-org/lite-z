import { Chat2ItemType } from "@/types/chat2";
import ChatDate from "./date";
import Linkify from "linkify-react";
import useAuth from "@/hooks/auth";
import ChatRepliedItem from "./replied-item";
import { useChat2 } from "@/hooks/chat/use-chat-2";
import MessageDeliveredState from "./delievered";
import { cn } from "@/lib/utils";
import Edited from "./edited";

type Props = {
  chat: Chat2ItemType;
  prev?: Chat2ItemType;
  next?: Chat2ItemType;
};
export default function ChatItemContent({ chat, next, prev }: Props) {
  const { user: myAccount } = useAuth();

  const user = chat.user;

  const isMyUser = myAccount?.id === user?.id;

  const linkElement = (
    attributes: { [attr: string]: any },
    content: string,
    type: "mention" | "link",
  ) => {
    let clss = "text-blue-600 whitespace-pre-wrap";
    if (type === "link") {
      clss += " hover:underline";
    }

    let view = content;

    return (
      <a
        className={clss}
        style={{
          overflowWrap: "break-word",
        }}
        target={type === "link" ? "_blank" : "_self"}
        {...attributes}
      >
        {view}
      </a>
    );
  };

  const prevBelongToMe = prev?.user === chat?.user;

  return (
    <div
      className={cn(
        "flex flex-col gap-y-2 bg-black/5 rounded-xl rounded-bl-none p-2 max-w-full w-auto min-w-[120px]",
        prevBelongToMe ? "rounded-tl-sm" : "",
      )}
    >
      {/* HEADER */}
      {chat?.reply_to ? (
        <ChatRepliedItem item={chat.reply_to} />
      ) : (
        !!!isMyUser &&
        !prevBelongToMe && (
          <strong className="min-w-[160px]">{user?.name}</strong>
        )
      )}
      {/* HEADER */}
      <p
        className="text-wrap mb-3 w-full"
        dir="auto"
        style={{
          overflowWrap: "break-word",
          wordBreak: "break-word",
          whiteSpace: "normal",
        }}
      >
        {chat.text.split("\n").map((line: string, index) => (
          <Linkify
            options={{
              nl2br: true,
              render: {
                url: ({ attributes, content }) =>
                  linkElement(attributes, content, "link"),
                mention: ({ attributes, content }) =>
                  linkElement(attributes, content, "mention"),
              },
              formatHref: {
                mention: () => "#",
              },
            }}
          >
            <span key={index}>
              {line}
              <br />
            </span>
          </Linkify>
        ))}

        {chat.translated_text !== null && (
          <>
            <div
              className={"w-full my-2 border-t-2 border-black border-dotted"}
            ></div>
            Translated:
            <br />
            {chat.translated_text?.split("\n").map((line: string, index) => (
              <Linkify
                options={{
                  nl2br: true,
                  render: {
                    url: ({ attributes, content }) =>
                      linkElement(attributes, content, "link"),
                    mention: ({ attributes, content }) =>
                      linkElement(attributes, content, "mention"),
                  },
                  formatHref: {
                    mention: () => "#",
                  },
                }}
              >
                <span key={index}>
                  {line}
                  <br />
                </span>
              </Linkify>
            ))}
          </>
        )}
      </p>
      <div className="flex flex-row items-center gap-x-2">
        {chat.is_edited && <Edited />}
        <ChatDate chat={chat} />
        <MessageDeliveredState chat={chat} />
      </div>
    </div>
  );
}
