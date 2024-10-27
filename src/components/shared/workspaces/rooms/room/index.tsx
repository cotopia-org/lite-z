import CotopiaButton from "@/components/shared-ui/c-button";
import ParticipantsWithPopover from "@/components/shared/participants/with-popover";
import { WorkspaceRoomShortType } from "@/types/room";
import { Cast } from "lucide-react";
import DeleteRoom from "./delete-room";
import { UserMinimalType, WorkspaceUserType } from "@/types/user";
import { uniqueById, urlWithQueryParams } from "@/lib/utils";
import useLoading from "@/hooks/use-loading";
//@ts-ignore
import { useSocket } from "@/routes/private-wrarpper";
import { useNavigate } from "react-router-dom";
import useQueryParams from "@/hooks/use-query-params";
import { useRoomHolder } from "@/components/shared/room";
import { useRoomContext } from "@/components/shared/room/room-context";

type Props = {
  room: WorkspaceRoomShortType;
  workspace_id: number;
  selected_room_id?: number;
  participants: WorkspaceUserType[];
};

export default function WorkspaceRoom({
  workspace_id,
  room,
  selected_room_id,
  participants,
}: Props) {
  const { startLoading, stopLoading, isLoading } = useLoading();

  const { joinRoom } = useRoomContext();

  const { query } = useQueryParams();

  const navigate = useNavigate();

  const socket = useSocket();

  const joinRoomHandler = async () => {
    if (!socket) return;

    if (selected_room_id !== room.id) {
      startLoading();
      joinRoom(room.id, () => {
        stopLoading();
        navigate(
          urlWithQueryParams(`/workspaces/${workspace_id}/rooms/${room.id}`, {
            ...query,
            isSwitching: true,
          })
        );
      });
    }
  };

  const isSelected = selected_room_id ? room?.id === selected_room_id : false;

  let clss = "!justify-start !text-left flex-1";
  if (isSelected) clss += ` !bg-black/10 !text-black`;

  return (
    <div className='flex flex-col gap-y-2'>
      <div className='flex flex-row items-center justify-between gap-x-2'>
        <CotopiaButton
          onClick={joinRoomHandler}
          className={clss}
          variant={isSelected ? "default" : "ghost"}
          startIcon={<Cast className='mr-2' size={16} />}
          disabled={isLoading}
          loading={isLoading}
        >
          {room.title}
        </CotopiaButton>
        <DeleteRoom room={room} onDelete={() => {}} />
      </div>
      <ParticipantsWithPopover
        roomId={room.id}
        participants={uniqueById(participants) as UserMinimalType[]}
      />
    </div>
  );
}
