import { useRoomContext } from '@/components/shared/room/room-context';
import React from 'react';

export default function SidebarOverview() {
  const { room } = useRoomContext();

  return <div className="capitalize">{room?.title ?? '-'}</div>;
}
