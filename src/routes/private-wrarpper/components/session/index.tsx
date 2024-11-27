import {
  ParticipantContext,
  TrackRefContext,
  TrackReferenceOrPlaceholder,
  useConnectionQualityIndicator,
  useMaybeParticipantContext,
  useMaybeTrackRefContext,
} from "@livekit/components-react";
import { createContext, useContext, useMemo } from "react";
import { TrackReferenceType } from "@/types/track-reference";
import { ConnectionQuality, Participant } from "livekit-client";
import DraggableCircle from "./draggable-circle";
import WithConnectionQuality from "./with-connection-quality";

function SpacialParticipantContextIfNeeded(
  props: React.PropsWithChildren<{
    participant?: Participant;
  }>
) {
  const hasContext = !!useMaybeParticipantContext();

  return props.participant && !hasContext ? (
    <ParticipantContext.Provider value={props.participant}>
      {props.children}
    </ParticipantContext.Provider>
  ) : (
    <>{props.children}</>
  );
}

const SessionContext = createContext<{
  track?: TrackReferenceType;
  draggable: boolean;
  meet?: boolean;
}>({
  track: undefined,
  draggable: false,
  meet: false,
});

export const useUserTile = () => useContext(SessionContext);

export function TrackRefContextIfNeeded(
  props: React.PropsWithChildren<{
    trackRef?: TrackReferenceType;
  }>
) {
  const hasContext = !!useMaybeTrackRefContext();
  return props.trackRef && !hasContext ? (
    <TrackRefContext.Provider value={props.trackRef as any}>
      {props.children}
    </TrackRefContext.Provider>
  ) : (
    <>{props.children}</>
  );
}

type Props = {
  participant?: Participant;
  track?: TrackReferenceOrPlaceholder;
  draggable?: boolean;
  isDragging?: boolean;
  username: string;
  meet?: boolean;
};

export default function UserSession({
  participant,
  track,
  draggable = false,
  isDragging = false,
  username,
  meet = false,
}: Props) {
  const trackRef = track;

  const maybeTrackRef = useMaybeTrackRefContext();

  const trackReference: TrackReferenceType = useMemo(() => {
    let latestTrack = {
      participant: trackRef?.participant ?? maybeTrackRef?.participant,
      source: trackRef?.source ?? maybeTrackRef?.source,
      publication: trackRef?.publication ?? maybeTrackRef?.publication,
    };

    return latestTrack;
  }, [maybeTrackRef, trackRef]);

  const { quality } = useConnectionQualityIndicator({ participant });

  let finalQuality = quality;

  if (participant?.identity === undefined)
    finalQuality = ConnectionQuality.Lost;

  return (
    <TrackRefContextIfNeeded trackRef={trackReference}>
      <SpacialParticipantContextIfNeeded
        participant={participant ?? trackReference?.participant}
      >
        <SessionContext.Provider
          value={{ track: trackReference, draggable, meet }}
        >
          <WithConnectionQuality quality={finalQuality}>
            <DraggableCircle
              defaultIsDragging={isDragging}
              username={username}
            />
          </WithConnectionQuality>
        </SessionContext.Provider>
      </SpacialParticipantContextIfNeeded>
    </TrackRefContextIfNeeded>
  );
}
