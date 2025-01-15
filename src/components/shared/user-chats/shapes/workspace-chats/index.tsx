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
  //

  return (
    <div className="flex flex-col gap-y-2">
      <AddChat workspace_id={workspace_id} />
      <SlidePusher>
        <ChatsWrapper workspace_id={workspace_id} />
      </SlidePusher>
    </div>
  );
}
