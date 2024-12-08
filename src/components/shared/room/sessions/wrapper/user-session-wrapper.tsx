import { useParticipants, useTracks } from "@livekit/components-react"
import { ReactNode, useMemo } from "react"
import UserSession from "./user-session"
import { RoomEvent, Track } from "livekit-client"

interface Props {
  username: string
  children: ReactNode
}

const UserSessionWrapper = ({ username, children }: Props) => {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.Microphone, withPlaceholder: false },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    {
      updateOnlyOn: [
        RoomEvent.ActiveSpeakersChanged,
        RoomEvent.Reconnected,
        RoomEvent.Reconnecting,
        RoomEvent.MediaDevicesChanged,
        RoomEvent.LocalTrackPublished,
        RoomEvent.TrackUnsubscribed,
      ],
      onlySubscribed: true,
    }
  )
  const participants = useParticipants()

  const participant = useMemo(() => {
    return participants.find((x) => x.identity === username)
  }, [participants, username])

  const track = useMemo(() => {
    if (!username) return undefined
    if (tracks.length === 0) return undefined

    return tracks.find((x) => {
      return x.participant.identity === username
    })
  }, [tracks, username])

  return (
    <UserSession track={track} participant={participant}>
      {children}
    </UserSession>
  )
}

export default UserSessionWrapper
