import AddChat from './add-chat';
import SlidePusher, { useSlides } from '@/components/shared/slide-pusher';
import ChatsWrapper from './chats-wrapper';
import { __BUS } from '@/const/bus';
import CTabs from '@/components/shared-ui/c-tabs';
import UserActionsAvatarButton from '@/components/shared/user-actions-avatar-button';
import { SoundIcon } from '@/components/icons';
import { colors } from '@/const/varz';
import WorkspaceSidebar from '@/routes/private-wrarpper/components/workspaces/sidebar';
import ChatIcon from '@/components/shared/room/settings/chat-icon';
import UserChat from '@/components/shared/room/settings/chat';
import useAuth from '@/hooks/auth';
import { useAppDispatch } from '@/store';
import { useRoomContext } from '@/components/shared/room/room-context';
import { useChat2 } from '@/hooks/chat/use-chat-2';
import { useEffect, useMemo, useState } from 'react';
import useBus from 'use-bus';
import { setCurrentChat } from '@/store/slices/chat-slice';
import ChatInnerHolder from '@/components/shared/user-chats/chat/holder';
import FullLoading from '@/components/shared/full-loading';
import { useApi } from '@/hooks/swr';
import { FolderType } from '@/types/chat2';

type Props = {
  workspace_id: number;
};

export default function WorkspaceChats({ workspace_id }: Props) {
  const { user } = useAuth();

  const dispatch = useAppDispatch();
  const { chats, chatObjects, loading } = useChat2({ workspace_id });

  const { push, back } = useSlides();

  const chatSortedByLastMessage = useMemo(() => {
    return chats.sort(
      (a, b) => b?.last_message?.created_at - a?.last_message?.created_at,
    );
  }, [chats]);

  const [tabsLoaded, setTabsLoaded] = useState(false);
  const [tabs, setTabs] = useState([
    {
      title: 'All',

      content: <ChatsWrapper chats={chatSortedByLastMessage} />,
      value: 'all',
    },
    {
      title: 'Unread',

      content: (
        <ChatsWrapper
          chats={chatSortedByLastMessage.filter((chat) => chat.unseens > 0)}
        />
      ),
      value: 'unread',
    },
    {
      title: 'Directs',

      content: (
        <ChatsWrapper
          chats={chatSortedByLastMessage.filter(
            (chat) => chat.type === 'direct',
          )}
        />
      ),
      value: 'directs',
    },
  ]);

  const { data: folderData } = useApi('/users/folders');
  const folders: FolderType[] = folderData?.data ?? [];

  useEffect(() => {
    if (folders.length === 0) return;

    // setTabs([]);

    for (const folder of folders) {
      setTabs([
        ...tabs,
        {
          title: folder.title,

          content: (
            <ChatsWrapper
              chats={chatSortedByLastMessage.filter(
                (chat) => chat.folder_id === folder.id,
              )}
            />
          ),
          value: folder.title + '-' + folder.id,
        },
      ]);
    }
    setTabsLoaded(true);
  }, [folders]);

  //

  //Select chat by use bus event
  useBus(__BUS.selectChat, (data) => {
    const chat = data.chat;

    dispatch(setCurrentChat(chat));
    push(<ChatInnerHolder onBack={back} chat_id={chat?.id} />);
  });
  let content = <></>;

  if (loading) {
    content = <FullLoading />;
  }

  if (tabsLoaded) {
    content = (
      <SlidePusher>
        <CTabs
          defaultValue={'all'}
          onChangeTab={(tab) => {
            console.log(tab);
          }}
          triggerClassName={
            '!bg-white data-[state=active]:!bg-white data-[state=active]:!text-primary data-[state=active]:!border-b-2 data-[state=active]:border-primary rounded-none'
          }
          className="[&>.tab-holder]:py-2 [&_.tabs-list]:w-full [&_.tab-holder_button]:w-full [&>.tab-holder]:shadow-app-bar "
          items={tabs}
        />
      </SlidePusher>
    );
  }

  return (
    <div className="flex flex-col gap-y-2">
      <AddChat workspace_id={workspace_id} />
      {content}
    </div>
  );
}
