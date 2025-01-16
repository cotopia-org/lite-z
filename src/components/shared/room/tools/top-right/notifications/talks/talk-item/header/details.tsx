import UserAvatar from '@/components/shared/user-avatar';
import React from 'react';
import { useTalk } from '..';

export default function TalkItemDetails() {
  const { talk } = useTalk();

  return (
    <div className="flex flex-row items-center gap-x-2 flex-nowrap whitespace-nowrap">
      <UserAvatar
        date={talk.owner.created_at}
        src={talk.owner?.avatar?.url}
        title={talk.owner?.username!}
        className="w-10 h-10"
      />
      <span className="py-1 px-2 bg-black/10 hover:bg-black/15 text-black rounded-md cursor-default">{`@${talk.owner.username}`}</span>
      invites you to talk
    </div>
  );
}
