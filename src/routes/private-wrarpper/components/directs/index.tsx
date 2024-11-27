import ChatWrapper from "@/components/shared/chat-wrapper";
import UserChatDirect from "@/components/shared/room/settings/chat/direct";
import TitleEl from "@/components/shared/title-el";

export default function DashbordDirects() {
  return (
    <ChatWrapper>
      <TitleEl title='Directs' className='h-[calc(100vh-130px)]'>
        <UserChatDirect />
      </TitleEl>
    </ChatWrapper>
  );
}
