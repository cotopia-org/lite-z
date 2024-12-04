import {
  TrackReferenceOrPlaceholder,
  useEnsureTrackRef,
} from "@livekit/components-react"

import SessionWrapper from "./wrapper"

import { useUserSessionCtx } from "@/components/shared/room/sessions/user-session"
import RfUserParticipant from "@/components/shared/participant-tiles/rf-user-participant"

type Props = {
  defaultIsDragging: boolean
  meet: boolean
  username: string
}

function DraggableCircle({ defaultIsDragging, meet, username }: Props) {
  const { track } = useUserSessionCtx()

  const trackRef = useEnsureTrackRef(track as TrackReferenceOrPlaceholder)

  if (!trackRef?.participant) return null
  return (
    <SessionWrapper>
      <RfUserParticipant
        trackRef={trackRef}
        isDragging={defaultIsDragging}
        username={username}
        meet={meet ?? false}
      />
    </SessionWrapper>
  )
}

export default DraggableCircle
