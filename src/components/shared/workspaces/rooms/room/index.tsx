import { WorkspaceRoomJoinType, WorkspaceRoomShortType } from '@/types/room';
import { WorkspaceUserType } from '@/types/user';
import { cn, uniqueById } from '@/lib/utils';
import useSetting from '@/hooks/use-setting';
import { playSoundEffect } from '@/lib/sound-effects';
import useLoading from '@/hooks/use-loading';
import axiosInstance, { FetchDataType } from '@/services/axios';
import { useAppDispatch } from '@/store';
import { setToken } from '@/store/slices/livekit-slice';
import RoomItem from './room-item';
import ParticipantRows from '@/components/shared/participant-rows';
import { dispatch as busDispatch } from 'use-bus';
import { __BUS } from '@/const/bus';
import { useRoomContext } from '@/components/shared/room/room-context';
import { useWorkspace } from '@/pages/workspace';
import useAuth from '@/hooks/auth';

type Props = {
  room: WorkspaceRoomShortType;
  workspace_id: number;
  selected_room_id?: number;
  participants: WorkspaceUserType[];
};

export default function WorkspaceRoom({
  room,
  selected_room_id,
  participants,
}: Props) {
  const { user } = useAuth();

  const { setActiveRoom, changeUserRoom } = useWorkspace();

  const { reduxSettings } = useSetting();

  const sounds = reduxSettings.sounds;

  const dispatch = useAppDispatch();

  const { updateParticipants, closeSidebarInMobile } = useRoomContext();

  const { startLoading, stopLoading } = useLoading();

  const joinRoomHandler = async () => {
    if (room.type === 'grid') closeSidebarInMobile();

    //Change user room in workspace datas
    changeUserRoom(user.id, room.id);

    if (selected_room_id !== room.id) {
      //Set active room ...
      setActiveRoom(room);

      startLoading();
      axiosInstance
        .get<FetchDataType<WorkspaceRoomJoinType>>(`/rooms/${room.id}/join`)
        .then((res) => {
          const livekitToken = res.data.data.token; //Getting livekit token from joinObject

          //set livekit token
          dispatch(setToken(livekitToken));

          // navigate(
          //   urlWithQueryParams(`/workspaces/${workspace_id}/rooms/${room.id}`, {
          //     isSwitching: true,
          //   }),
          // );

          stopLoading();

          if (sounds.userJoinLeft) playSoundEffect('joined');

          //Update participants of room context
          updateParticipants(res.data.data.participants ?? []);

          //Dispatch rf canvas to inform new participants
          busDispatch({
            type: __BUS.initRoomParticipantsOnRf,
            participants: res.data.data.participants ?? [],
            background: (res?.data?.data as any)?.background ?? undefined,
          });
          busDispatch(__BUS.stopMyScreenSharing);
          busDispatch(__BUS.refreshNodeAudio);
        })
        .catch((err) => {
          stopLoading();
        });
    }
  };

  const isSelected = selected_room_id ? room?.id === selected_room_id : false;

  let clss = '!justify-start !text-left flex-1';
  if (isSelected) clss += ` !bg-black/10 !text-black`;

  return (
    <div
      className={cn(
        'flex flex-col gap-y-2',
        room.type === 'flow' ? 'hidden md:flex' : '',
      )}
    >
      <RoomItem
        joinRoomHandler={joinRoomHandler}
        room={room}
        isSelected={isSelected}
      />
      <ParticipantRows
        participants={uniqueById(participants) as WorkspaceUserType[]}
      />
    </div>
  );
}
