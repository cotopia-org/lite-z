import {
  TrackReferenceOrPlaceholder,
  useEnsureTrackRef,
} from "@livekit/components-react"

import SessionWrapper from "./wrapper"

import RfUserParticipant from "@/components/shared/participant-tiles/rf-user-participant"
import { useUserSessionCtx } from "@/components/shared/room/sessions/wrapper/user-session"

type Props = {
  defaultIsDragging: boolean
  meet: boolean
  username: string
}

function DraggableCircle({ defaultIsDragging, meet, username }: Props) {
  const { track } = useUserSessionCtx()

  const trackRef = useEnsureTrackRef(track as TrackReferenceOrPlaceholder)

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
