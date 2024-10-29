import { WorkspaceRoomShortType } from "@/types/room"
import { WorkspaceUserType } from "@/types/user"
import { uniqueById, urlWithQueryParams } from "@/lib/utils"
import useLoading from "@/hooks/use-loading"
//@ts-ignore
import { useSocket } from "@/routes/private-wrarpper"
import { useNavigate } from "react-router-dom"
import useQueryParams from "@/hooks/use-query-params"
import { useRoomContext } from "@/components/shared/room/room-context"
import RoomItem from "./room-item"
import ParticipantRows from "@/components/shared/participant-rows"

type Props = {
  room: WorkspaceRoomShortType
  workspace_id: number
  selected_room_id?: number
  participants: WorkspaceUserType[]
}

export default function WorkspaceRoom({
  workspace_id,
  room,
  selected_room_id,
  participants,
}: Props) {
  const { startLoading, stopLoading } = useLoading()

  const { joinRoom } = useRoomContext()

  const { query } = useQueryParams()

  const navigate = useNavigate()

  const socket = useSocket()

  const joinRoomHandler = async () => {
    if (!socket) return

    if (selected_room_id !== room.id) {
      startLoading()
      joinRoom(room.id, () => {
        stopLoading()
        navigate(
          urlWithQueryParams(`/workspaces/${workspace_id}/rooms/${room.id}`, {
            ...query,
            isSwitching: true,
          })
        )
      })
    }
  }

  const isSelected = selected_room_id ? room?.id === selected_room_id : false

  let clss = "!justify-start !text-left flex-1"
  if (isSelected) clss += ` !bg-black/10 !text-black`

  return (
    <div className="flex flex-col gap-y-3">
      <RoomItem
        joinRoomHandler={joinRoomHandler}
        room={room}
        isSelected={isSelected}
      />
      <ParticipantRows
        participants={uniqueById(participants) as WorkspaceUserType[]}
      />
      {/* <ParticipantsWithPopover
        avatarClss="border border-primary"
        className="ml-6"
        roomId={room.id}
        participants={uniquedParticipants as WorkspaceUserType[]}
      /> */}
    </div>
  )
}
