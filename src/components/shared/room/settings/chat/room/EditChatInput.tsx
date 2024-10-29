import EditMessageInfo from "@/components/shared/chat-box/chat-item/TargetMessageAction/EditMessageInfo"
import MentionableChatInput from "@/components/shared/chat-box/user-input/mentionable-chat-input"
import { useChatRoomCtx } from "@/context/chat-room-context"
import { MessagePayloadType } from "@/hooks/chat/use-chat-socket"
import { ChatItemType } from "@/types/chat"

interface Props {
  message: ChatItemType
  onAdd: (payload: MessagePayloadType) => void
}

const EditChatInput = ({ message, onAdd }: Props) => {
  const { text } = message

  const { changeBulk } = useChatRoomCtx()

  const closeReplyHandler = () => {
    changeBulk({ targetMessage: null, flag: undefined })
  }

  const selectedMessageNode = (
    <EditMessageInfo
      title={`Edit on`}
      desc={text}
      onClose={closeReplyHandler}
    />
  )

  return <MentionableChatInput onAdd={onAdd} beforeNode={selectedMessageNode} />
}

export default EditChatInput
