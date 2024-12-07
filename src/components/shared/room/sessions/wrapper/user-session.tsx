import { TrackReferenceOrPlaceholder } from "@livekit/components-core"
import { Participant } from "livekit-client"
import { ReactNode, createContext, useContext, useMemo } from "react"
import { useMaybeTrackRefContext } from "@livekit/components-react"
import { TrackReferenceType } from "@/types/track-reference"
import { useAllTrackContext } from "../context/tracks-provider"
import TrackRefContextIfNeeded from "./track-ref-context-if-needed"
import ParticipantContextIfNeeded from "./participant-context-if-needed"

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
  const { tracks } = useAllTrackContext()

  const initTrack = tracks?.[0]
  const trackRef = track

  const maybeTrackRef = useMaybeTrackRefContext()

  const trackReference: TrackReferenceType = useMemo(() => {
    let latestTrack = {
      participant:
        trackRef?.participant ??
        maybeTrackRef?.participant ??
        initTrack?.participant,
      source: trackRef?.source ?? maybeTrackRef?.source ?? initTrack?.source,
      publication:
        trackRef?.publication ??
        maybeTrackRef?.publication ??
        initTrack?.publication,
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
