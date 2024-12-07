import { useParticipants } from "@livekit/components-react"
import { useAllTrackContext } from "../context/tracks-provider"
import { ReactNode, useMemo } from "react"
import UserSession from "./user-session"

interface Props {
  username: string
  children: ReactNode
}

const UserSessionWrapper = ({ username, children }: Props) => {
  const { tracks } = useAllTrackContext()
  const participants = useParticipants()

  const participant = useMemo(() => {
    return participants.find((x) => x.identity === username)
  }, [participants, username])

  const track = useMemo(() => {
    if (username) return undefined
    if (tracks.length === 0) return undefined
    return tracks.find((x) => x.participant.identity === username)
  }, [tracks, username])

  return (
    <UserSession track={track} participant={participant}>
      {children}
    </UserSession>
  )
}

export default UserSessionWrapper
