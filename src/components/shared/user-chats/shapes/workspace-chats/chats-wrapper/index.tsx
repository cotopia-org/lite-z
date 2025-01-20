import { useRoomContext } from '@/components/shared/room/room-context';
import { useChat2 } from '@/hooks/chat/use-chat-2';
import { useEffect, useMemo, useState } from 'react';
import Chat from '../../../chat';
import FullLoading from '@/components/shared/full-loading';
import useBus from 'use-bus';
import { __BUS } from '@/const/bus';
import { useAppDispatch } from '@/store';
import { setCurrentChat } from '@/store/slices/chat-slice';
import { useSlides } from '@/components/shared/slide-pusher';
import ChatInnerHolder from '../../../chat/holder';
import { useSocket } from '@/routes/private-wrarpper';
import { MessageType } from '@/types/message';
import useAuth from '@/hooks/auth';
import { ChatType, FolderType } from '@/types/chat2';
import CTabs from '@/components/shared-ui/c-tabs';
import { useApi } from '@/hooks/swr';
import CBadgeSimple from '@/components/shared-ui/c-badge/c-badge-simple';
import { MessagesIcon } from '@/components/icons';
import { colors } from '@/const/varz';

export default function ChatsWrapper({
  workspace_id,
}: {
  workspace_id: number;
}) {
  const dispatch = useAppDispatch();
  const { chats, chatObjects, loading } = useChat2({ workspace_id });

  const { push, back } = useSlides();

  const [active, setActive] = useState('all');
  const chatSortedByLastMessage = useMemo(() => {
    return chats.sort(
      (a, b) => b?.last_message?.created_at - a?.last_message?.created_at,
    );
  }, [chats]);

  const [tabs, setTabs] = useState([
    {
      title: 'All',

      condition: () => {
        return true;
      },

      value: 'all',
    },
    {
      title: 'Unread',
      condition: (chat: ChatType) => chat.unseens > 0,

      value: 'unread',
    },
    {
      title: 'Directs',
      condition: (chat: ChatType) => chat.type === 'direct',

      value: 'directs',
    },
  ]);

  const { data: folderData } = useApi('/users/folders');
  const folders: FolderType[] = folderData?.data ?? [];

  useEffect(() => {
    if (folders.length === 0) return;

    for (const folder of folders) {
      if (
        tabs.find((tab) => tab.value === folder.title + '-' + folder.id) ===
        undefined
      ) {
        setTabs([
          ...tabs,
          {
            title: folder.title,

            condition: (chat) => chat.folder_id === folder.id,
            value: folder.title + '-' + folder.id,
          },
        ]);
      }
    }
  }, [folders]);

  useBus(__BUS.selectChat, (data) => {
    const chat = data.chat;

    dispatch(setCurrentChat(chat));
    push(<ChatInnerHolder onBack={back} chat_id={chat?.id} />);
  });

  // let content = (
  //   <CTabs
  //     defaultValue={'all'}
  //     onChangeTab={(tab) => {
  //       console.log(tab);
  //     }}
  //     triggerClassName={
  //       '!bg-white data-[state=active]:!bg-white data-[state=active]:!text-primary data-[state=active]:!border-b-2 data-[state=active]:border-primary rounded-none'
  //     }
  //     className="[&>.tab-holder]:py-2 [&_.tabs-list]:w-full [&_.tab-holder_button]:w-full [&>.tab-holder]:shadow-app-bar "
  //     items={tabs}
  //   />
  // );

  const chatItems = chatSortedByLastMessage.filter((chat) =>
    tabs.find((tab) => tab.value === active)?.condition(chat),
  );

  return (
    <div className="w-full chats-holder  flex flex-col gap-y-0 overflow-y-auto h-[calc(100vh-80px)] pb-20">
      <div className={'w-full flex flex-row justify-between my-2 shadow-sm'}>
        {tabs.map((tab, key) => {
          return (
            <TabButton
              key={key}
              unseens={chatSortedByLastMessage
                .filter((chat) => tab.condition(chat))
                .reduce((current, c) => current + c.unseens, 0)}
              onClick={(value) => {
                setActive(value);
              }}
              active={active}
              tab={tab}
            />
          );
        })}
      </div>
      {chatItems.length > 0 ? (
        chatItems.map((chat) => <Chat chat={chat} key={chat?.id} />)
      ) : (
        <div
          className={
            'flex text-center items-center justify-center m-auto h-full w-full'
          }
        >
          <span>There's no chats</span>
        </div>
      )}
    </div>
  );
}

function TabButton({
  onClick,
  active,
  tab,
  unseens,
}: {
  onClick: (item: string) => void;
  active: string;
  tab: {
    title: string;
    value: string;
    condition: (chat: ChatType) => boolean;
  };
  unseens: number;
}) {
  const isActive = active === tab.value;
  return (
    <button
      onClick={() => {
        onClick(tab.value);
      }}
      className={
        'px-4 py-2  w-full text-center rounded-lg' +
        (isActive && ' border-b-2 border-primary rounded-none')
      }
    >
      <div
        className={
          ' flex flex-row text-sm text-slate-500 items-center justify-center gap-1 w-full' +
          (isActive && ' !text-black')
        }
      >
        <div>{tab.title}</div>
        {unseens > 0 && tab.title !== 'All' && (
          <div
            className={'h-4 w-4 text-center text-xs bg-slate-300  rounded-full'}
          >
            {unseens}
          </div>
        )}
      </div>
    </button>
  );
}
