import { TrackReferenceOrPlaceholder } from "@livekit/components-core"
import { Participant } from "livekit-client"
import { ReactNode, createContext, useContext, useMemo } from "react"
import { ParticipantContextIfNeeded, TrackRefContextIfNeeded } from "./wrapper"
import { useMaybeTrackRefContext } from "@livekit/components-react"
import { TrackReferenceType } from "@/types/track-reference"

type Props = {
  participant?: Participant
  track?: TrackReferenceOrPlaceholder
  children: ReactNode
}

const UserSessionContext = createContext<{ track?: TrackReferenceType }>({
  track: undefined,
})

export const useUserSessionCtx = () => useContext(UserSessionContext)

const UserSession = ({ track, participant, children }: Props) => {
  const trackRef = track

  const maybeTrackRef = useMaybeTrackRefContext()

  const trackReference: TrackReferenceType = useMemo(() => {
    let latestTrack = {
      participant: trackRef?.participant ?? maybeTrackRef?.participant,
      source: trackRef?.source ?? maybeTrackRef?.source,
      publication: trackRef?.publication ?? maybeTrackRef?.publication,
    }

    return latestTrack
  }, [maybeTrackRef, trackRef])

  return (
    <TrackRefContextIfNeeded trackRef={trackReference}>
      <ParticipantContextIfNeeded
        participant={participant ?? trackReference?.participant}
      >
        <UserSessionContext.Provider value={{ track: trackReference }}>
          {children}
        </UserSessionContext.Provider>
      </ParticipantContextIfNeeded>
    </TrackRefContextIfNeeded>
  )
}

export default UserSession
