import AddChat from "./add-chat";
import SlidePusher from "@/components/shared/slide-pusher";
import { useChat2 } from "@/hooks/chat/use-chat-2";
import ChatsWrapper from "./chats-wrapper";
import { Chat2ItemType, ChatType } from "@/types/chat2";
//@ts-ignore
import { useSocket } from "@/routes/private-wrarpper";
import { MessageType } from "@/types/message";
import { useAppDispatch } from "@/store";
import axiosInstance, { FetchDataType } from "@/services/axios";
import { addMessage, addNewChat, setChatMessages, upcommingMessage, updateMessage } from "@/store/slices/chat-slice";
import useAuth from "@/hooks/auth";

type Props = {
  workspace_id: number;
};
export default function WorkspaceChats({ workspace_id }: Props) {

  const dispatch = useAppDispatch();
  
  const {user} = useAuth()

  const { add , chatObjects} = useChat2({ workspace_id });

  useSocket('messageSeen', (data: MessageType) => {
    console.log('messageSeen', data);
  })

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
      }
    }
    
  }, [chatObjects])


  let content = (
    <>
      <AddChat workspace_id={workspace_id} />
      <SlidePusher>
        <ChatsWrapper />
      </SlidePusher>
    </>
  );

  return <div className='flex flex-col gap-y-2'>{content}</div>;
}
