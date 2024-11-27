import CotopiaPrompt from "@/components/shared-ui/c-prompt"
import { useChatRoomCtx } from "@/context/chat-room-context"
import useAuth from "@/hooks/auth"
import { useChatSocket } from "@/hooks/chat/use-chat-socket"
import { useAppDispatch } from "@/store"

import { ChatItemType } from "@/types/chat"
import { useCallback } from "react"
import { toast } from "sonner"

interface Props {
  message: ChatItemType
  onClose: () => void
}

const DeleteMessageAction = ({ message, onClose }: Props) => {
  const { user } = useAuth()
  const { roomId, env } = useChatRoomCtx()

  const { remove } = useChatSocket(roomId, user, env)

  const appDispatch = useAppDispatch()

  const deleteMessageHandler = useCallback(async () => {
    try {
      await remove({ message })
      onClose()
    } catch (error) {}
  }, [message, onClose, appDispatch])

  return (
    <CotopiaPrompt
      open
      title="Delete Message"
      submitText="Delete"
      description="Do you want to delete this message?"
      onSubmit={deleteMessageHandler}
      onClose={onClose}
      isPortal={false}
    />
  )
}

export default DeleteMessageAction
