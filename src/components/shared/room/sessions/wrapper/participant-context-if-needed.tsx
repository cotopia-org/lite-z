import {
  ParticipantContext,
  useMaybeParticipantContext,
} from "@livekit/components-react"
import { Participant } from "livekit-client"

function ParticipantContextIfNeeded(
  props: React.PropsWithChildren<{
    participant?: Participant
  }>
) {
  const hasContext = !!useMaybeParticipantContext()

  return props.participant && !hasContext ? (
    <ParticipantContext.Provider value={props.participant}>
      {props.children}
    </ParticipantContext.Provider>
  ) : (
    <>{props.children}</>
  )
}

export default ParticipantContextIfNeeded
