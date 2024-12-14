import FullLoading from "@/components/shared/full-loading"
import { useApi } from "@/hooks/swr"
import WorkspaceRooms from "@/components/shared/workspaces/rooms"
import { WorkspaceRoomShortType } from "@/types/room"
import { useEffect, useState } from "react"
import { FetchDataType } from "@/services/axios"
import { useSocket } from "@/routes/private-wrarpper"
import { useParams } from "react-router-dom"
import { WorkspaceUserType } from "@/types/user"

type Props = {
  workspace_id: string
  workspaceUsers: WorkspaceUserType[]
}

export default function WorkspaceRoomsHolder({
  workspace_id,
  workspaceUsers,
}: Props) {
  const { room_id } = useParams()

  const [rooms, setRooms] = useState<WorkspaceRoomShortType[]>([])

  const { data, isLoading } = useApi<FetchDataType<WorkspaceRoomShortType[]>>(
    `/workspaces/${workspace_id}/rooms`
  )
  const items = !!data ? data?.data : []

  useEffect(() => {
    if (items.length > 0) setRooms(items)
  }, [items])

  useSocket("workspaceRoomUpdated", (data: WorkspaceRoomShortType) => {
    const room: WorkspaceRoomShortType = data
    setRooms((prev) =>
      prev.map((prevRoom) => {
        if (prevRoom.id === room.id) {
          return room
        }

        return prevRoom
      })
    )
  })

  useSocket("roomCreated", (room: WorkspaceRoomShortType) => {
    setRooms((prev) => [...prev, room])
  })
  useSocket("roomDeleted", (roomId: number) => {
    setRooms((crt) => {
      return crt.filter((r) => r.id !== roomId)
    })
  })

  let content = (
    <div className="flex flex-col h-full justify-between items-center">
      <WorkspaceRooms
        workspace_id={+workspace_id}
        rooms={rooms}
        workspaceUsers={workspaceUsers}
        selected_room_id={room_id ? +room_id : undefined}
      />
    </div>
  )

  if (isLoading) content = <FullLoading />

  return content
}
