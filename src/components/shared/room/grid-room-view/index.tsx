import { useEffect, useRef, useState } from 'react';
import { useRoomContext } from '../room-context';
import { TracksContextProvider } from '../sessions/context';
import MeetingWrapper from './wrapper';
import { UserMinimalType } from '@/types/user';
import useBus from 'use-bus';
import { __BUS } from '@/const/bus';
import { useAllTrackContext } from '../sessions/context/tracks-provider';
import { cn, isScreenShareExist, uniqueById } from '@/lib/utils';
import { useSocket } from '@/routes/private-wrarpper';
import { LivekitTrackPublishedType, UserLeftJoinType } from '@/types/socket';
import MeetingRoom from './meeting-room';
import { RoomAudioRenderer } from '@livekit/components-react';

interface Props {}

export enum MeetingTileType {
  'UserTile' = 'user',
  'ShareScreenTile' = 'screen_share',
}

export type MeetingNodeType = {
  id: string | number;
  type: MeetingTileType;
  participant: UserMinimalType;
};

const GridRoomView = (props: Props) => {
  const { room, showSidebar } = useRoomContext();
  const [nodes, setNodes] = useState<MeetingNodeType[]>([]);

  const { tracks } = useAllTrackContext();

  const initRef = useRef(false);
  const isInitShareScreen = useRef(false);

  const { hasShareScreen, shareScreenTrack } = isScreenShareExist(tracks);

  useEffect(() => {
    const initParticipants = uniqueById(room?.participants || []);
    if (!hasShareScreen) return;
    if (!shareScreenTrack) return;
    if (isInitShareScreen.current === true) return;

    const targetParticipant = initParticipants.find(
      (p) => p.username === shareScreenTrack.participant.identity,
    ) as UserMinimalType;

    setNodes((crt) => {
      return [
        ...crt,
        {
          id: shareScreenTrack?.publication?.track?.sid as string,
          type: MeetingTileType.ShareScreenTile,
          participant: targetParticipant,
        },
      ];
    });
    isInitShareScreen.current = true;
  }, [hasShareScreen, shareScreenTrack, room?.participants]);

  useEffect(() => {
    const initParticipants = uniqueById(
      room?.participants || [],
    ) as UserMinimalType[];
    if (initRef.current === true) return;
    if (initParticipants.length === 0) return;
    setNodes(
      initParticipants.map((p) => ({
        id: p.id,
        type: MeetingTileType.UserTile,
        participant: p,
      })),
    );
    initRef.current = true;
  }, [room?.participants]);

  useBus(
    __BUS.initRoomParticipantsOnRf,
    (data: any) => {
      //update participants when somebody join into the room
      const participants = uniqueById(
        data?.participants || [],
      ) as UserMinimalType[];
      setNodes(
        participants.map((p) => ({
          id: p.id,
          type: MeetingTileType.UserTile,
          participant: p,
        })),
      );
    },
    [nodes],
  );

  useSocket(
    'livekitEvent',
    (data: LivekitTrackPublishedType) => {
      switch (data.event) {
        case 'track_published':
          switch (data.track.source) {
            case 'SCREEN_SHARE':
              const target_user = nodes.find(
                (n) => n.participant.username === data?.participant.identity,
              )?.participant;
              setNodes((crt) => [
                ...crt,
                {
                  id: data.track.sid,
                  type: MeetingTileType.ShareScreenTile,
                  participant: target_user as UserMinimalType,
                },
              ]);
              break;
          }
          break;
        case 'track_unpublished':
          switch (data.track.source) {
            case 'SCREEN_SHARE':
              setNodes((crt) => crt.filter((n) => n.id !== data?.track.sid));
              break;
          }
          break;
      }
    },
    [nodes],
  );

  useSocket(
    'userLeftFromRoom',
    (data: UserLeftJoinType) => {
      if (data.room_id === room?.id) {
        setNodes((prev) => {
          return prev.filter(
            (n) => n.participant.username !== data.user.username,
          );
        });
      }
    },
    [room?.id],
  );

  useSocket(
    'userJoinedToRoom',
    (data: UserLeftJoinType) => {
      if (data.room_id === room?.id) {
        setNodes((prev) => {
          return [
            ...prev,
            {
              id: data.user.id,
              type: MeetingTileType.UserTile,
              participant: data.user,
            },
          ];
        });
      }
    },
    [room?.id],
  );

  return (
    <TracksContextProvider>
      <div
        id="room-view"
        className={cn(
          'w-full h-full bg-black top-0 left-0 fixed ',
          !showSidebar ? 'md:relative z-20' : '',
        )}
      >
        <MeetingWrapper>
          <MeetingRoom nodes={nodes} />
          <RoomAudioRenderer />
        </MeetingWrapper>
      </div>
    </TracksContextProvider>
  );
};

export default GridRoomView;
