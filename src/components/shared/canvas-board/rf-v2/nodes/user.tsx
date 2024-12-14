import { useMemo } from "react"
import { useParticipants } from "@livekit/components-react"
import DraggableCircle from "@/routes/private-wrarpper/components/session/draggable-circle"
import { useAllTrackContext } from "@/components/shared/room/sessions/context/tracks-provider"
import UserSession from "@/components/shared/room/sessions/wrapper/user-session"

const UserNode = (props: any) => {
  const { data, dragging } = props

  const { tracks } = useAllTrackContext()
  const participants = useParticipants()

  const participant = useMemo(() => {
    return participants.find((x) => x.identity === data.username)
  }, [participants])

  const track = useMemo(() => {
    if (!data?.username) return undefined
    if (tracks.length === 0) return undefined
    return tracks.find((x) => x.participant.identity === data.username)
  }, [tracks, data.username])

  return (
    <UserSession track={track} participant={participant}>
      <DraggableCircle
        meet={data?.meet ?? false}
        defaultIsDragging={dragging}
        username={data?.username ?? ""}
      />
    </UserSession>
  )
}

export default UserNode
