import {
  ParticipantTileProps,
  TrackReferenceOrPlaceholder,
  isTrackReference,
  useConnectionQualityIndicator,
  useParticipantTile,
} from "@livekit/components-react"
import {
  ForwardedRef,
  HTMLAttributes,
  createContext,
  forwardRef,
  useContext,
} from "react"
import {
  ParticipantContextIfNeeded,
  TrackRefContextIfNeeded,
} from "@/components/shared/room/sessions/wrapper"
import { TrackReferenceType } from "@/types/track-reference"
import { useRoomContext } from "../room/room-context"
import { getUserFullname } from "@/lib/utils"
import { ConnectionQuality, Track } from "livekit-client"
import { UserMinimalType } from "@/types/user"

const UserParticipantTileContext = createContext<{
  ref: ForwardedRef<HTMLDivElement>
  htmlProps: HTMLAttributes<HTMLDivElement>
  livekitIdentity: string
  userFullName: string
  isSpeaking: boolean
  trackType: "audio" | "video"
  trackRef?: TrackReferenceOrPlaceholder
  targetUser?: UserMinimalType
  quality: ConnectionQuality
  qualityTitle: string
}>({
  ref: null,
  htmlProps: {},
  livekitIdentity: "",
  userFullName: "",
  isSpeaking: false,
  trackType: "audio",
  quality: ConnectionQuality.Unknown,
  qualityTitle: "",
  targetUser: undefined,
  trackRef: undefined,
})

const ParticipantTileProvider = forwardRef<
  HTMLDivElement,
  ParticipantTileProps & { username: string }
>(function ParticipantTile(
  {
    trackRef,
    children,
    onParticipantClick,
    disableSpeakingIndicator,
    username,
    ...htmlProps
  }: ParticipantTileProps & { username: string },
  ref
) {
  const trackReference = trackRef as TrackReferenceOrPlaceholder

  const participantObj = useParticipantTile({
    htmlProps,
    disableSpeakingIndicator,
    onParticipantClick,
    trackRef: trackReference,
  })

  const { room } = useRoomContext()

  const participants = room?.participants ?? []

  const targetUser = participants?.find((x) => x?.username === username)

  const userFullName = getUserFullname(targetUser)

  const livekitIdentity = trackReference?.participant?.identity

  const isSpeaking = trackReference?.participant?.isSpeaking

  const elementProps = participantObj?.elementProps ?? {}
  // const elementProps = {}

  let participant_identity = trackReference?.participant?.identity
  let track_participant = trackReference?.participant

  let finalQuality: any = ConnectionQuality.Poor

  if (track_participant) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    finalQuality = useConnectionQualityIndicator({
      participant: trackReference.participant,
    }).quality
  }

  let quality_title: string = "unknown!"

  if (
    finalQuality === ConnectionQuality.Lost ||
    finalQuality === ConnectionQuality.Poor
  ) {
    quality_title = "Poor connection!"
  }

  if (targetUser?.username !== participant_identity) {
    finalQuality = ConnectionQuality.Lost
  }
  if (participant_identity === undefined) finalQuality = ConnectionQuality.Lost

  let trackType: "audio" | "video" = "audio"

  if (isTrackReference(trackReference)) {
    trackType = "audio"
    if (
      trackReference.publication?.kind === "video" &&
      trackReference.source === Track.Source.Camera &&
      !trackReference?.publication?.track?.isMuted
    ) {
      trackType = "video"
    }
  }

  return (
    <TrackRefContextIfNeeded trackRef={trackReference as TrackReferenceType}>
      <ParticipantContextIfNeeded participant={track_participant}>
        <UserParticipantTileContext.Provider
          value={{
            ref,
            htmlProps: elementProps,
            livekitIdentity,
            isSpeaking,
            userFullName,
            trackType,
            quality: finalQuality,
            qualityTitle: quality_title,
            targetUser,
            trackRef: trackReference,
          }}
        >
          {children}
        </UserParticipantTileContext.Provider>
      </ParticipantContextIfNeeded>
    </TrackRefContextIfNeeded>
  )
})

export const useParticipantTileCtx = () =>
  useContext(UserParticipantTileContext)

export default ParticipantTileProvider
