import { useEffect, useState } from "react"
import CTabs from "@/components/shared-ui/c-tabs"
import UserChat from "./chat"
import WorkspaceSidebar from "@/routes/private-wrarpper/components/workspaces/sidebar"
import { SoundIcon } from "@/components/icons"
import { colors } from "@/const/varz"
import { useRoomContext } from "../room-context"
import { useAppDispatch } from "@/store"
import { addMessage, addNewChat, getChats, setChatMessages, upcommingMessage, updateMessage } from "@/store/slices/chat-slice"
import ChatIcon from "./chat-icon"
import UserActionsAvatarButton from "../../user-actions-avatar-button"
import ChatEvents from "./chat-events"
import useAuth from "@/hooks/auth"
import { useChat2 } from "@/hooks/chat/use-chat-2"
import { useSocket } from "@/routes/private-wrarpper"
import { MessageType } from "@/types/message"
import axiosInstance, { FetchDataType } from "@/services/axios"
import { ChatType } from "@/types/chat2"
import {dispatch as busDispatch} from 'use-bus'
import { __BUS } from "@/const/bus"

export default function RoomSettings() {
  const { workspace_id } = useRoomContext()

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!workspace_id) return

    dispatch(getChats({ workspace_id: +workspace_id }))
  }, [workspace_id])

  
  const {user} = useAuth()

  //@ts-ignore
  const { chatObjects} = useChat2({ workspace_id: +workspace_id as number });

  useSocket('messageSeen', (data: {
    chat_id: number
    message_id: number
    user_id: number}) => {
    console.log('messageSeen', data);

    const targetChat = chatObjects?.[data.chat_id]

    if (!targetChat) return

    const message = targetChat?.messages?.find(a => a?.id === data?.message_id)
  

      if (!message) return

    dispatch(updateMessage({...message, seens: [...new Set([...message.seens, data.user_id])]}))

  }, [chatObjects])

  useSocket('newMessage', async (newMessage: MessageType) => {

    console.log('newMessage', newMessage);

    const targetChat = chatObjects?.[newMessage.chat_id]

    if ( newMessage.user !== user.id)
    dispatch(upcommingMessage({message: {...newMessage, is_delivered: true,is_pending: false, is_rejected: false}}))

    if ( targetChat === undefined ) {

      //We should add chat object to our slice
      const chatObjectRes = await axiosInstance.get<FetchDataType<ChatType>>(`/chats/${newMessage.chat_id}`);
      const chatMessagesRes = await axiosInstance.get<FetchDataType<MessageType[]>>(`/chats/${newMessage.chat_id}/messages`);
      const chatObject = chatObjectRes?.data?.data
      const chatObjectMessags = chatMessagesRes?.data?.data ?? []
      dispatch(addNewChat(chatObject))
      dispatch(setChatMessages(chatObjectMessags.map(item => ({...item, is_delivered: true,is_pending: false, is_rejected: false}))))

    } else {

      const chatMesssages = targetChat?.messages ?? []

      const foundMessage = chatMesssages.findIndex(a => a.nonce_id === newMessage.nonce_id);

      if ( foundMessage > -1) {
        //We should update state of message
        console.log('update state of message, for instance to sent');
        dispatch(updateMessage({...newMessage, is_delivered: true, is_pending: false, is_rejected: false}))
      } else {
        //We should add our message to slice
        console.log('add our message to chat messages as a new incoming message')
        dispatch(addMessage({...newMessage, is_delivered: true, is_pending: false, is_rejected: false}))
        if ( user.id !== newMessage.user )
          setTimeout(() => {
            busDispatch(__BUS.scrollEndChatBox)
          }, 10)
          
      }
    }
    
  }, [chatObjects])


  const [value, setValue] = useState("rooms")

  return (
    <div className="flex flex-col gap-y-4">
      <ChatEvents />
      <CTabs
        title={
          <div>
            <UserActionsAvatarButton size="large" />
          </div>
        }
        defaultValue={value}
        onChangeTab={setValue}
        className=" [&>.tab-holder]:p-6 [&>.tab-holder]:py-4 [&>.tab-holder]:shadow-app-bar"
        items={[
          {
            icon: <SoundIcon color={colors.grayscale.grayscaleCaption} />,
            content: <WorkspaceSidebar />,
            value: "rooms",
          },
          {
            icon: <ChatIcon />,
            content: <UserChat />,
            value: "chat",
          },
          // {
          //   icon: (
          //     <Profile2UserIcon color={colors.grayscale.grayscaleCaption} />
          //   ),
          //   content: <WorkspaceUsers />,
          //   value: "users",
          // },
        ]}
      />
    </div>
  )
}
