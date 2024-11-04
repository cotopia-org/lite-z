"use client";

import RoomWrapper from "@/components/shared/room/wrapper";
import useQueryParams from "@/hooks/use-query-params";
import RoomHolder from "../room";

type Props = {
  token: string; //Currently we are using livekit, so livekit token
  workspace_id: string;
  room_id: number;
};
export default function RoomSpatialWrapper({
  token,
  workspace_id,
  room_id,
}: Props) {
  const { query } = useQueryParams();

  return (
    <div className='max-h-screen'>
      <RoomWrapper>
        <RoomHolder
          token={token}
          room_id={room_id}
          workspace_id={workspace_id}
          isSwitching={query?.isSwitching}
        />
      </RoomWrapper>
    </div>
  );
}
