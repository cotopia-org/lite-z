import { getTrackReferenceId, isLocal } from "@livekit/components-core";
import { useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";
import { AudioTrack } from "./audio-track";
import { useRoomContext } from "../../room-context";
import useAuth from "@/hooks/auth";
import { VARZ } from "@/const/varz";
import { UserMinimalType, WorkspaceUserType } from "@/types/user";
import { useReactFlow } from "@xyflow/react";

/** @public */
export interface RoomAudioRendererProps {
  /** Sets the volume for all audio tracks rendered by this component. By default, the range is between `0.0` and `1.0`. */
  volume?: number;
  /**
   * If set to `true`, mutes all audio tracks rendered by the component.
   * @remarks
   * If set to `true`, the server will stop sending audio track data to the client.
   * @alpha
   */
  muted?: boolean;
}

/**
 * The `RoomAudioRenderer` component is a drop-in solution for adding audio to your LiveKit app.
 * It takes care of handling remote participants’ audio tracks and makes sure that microphones and screen share are audible.
 *
 * @example
 * ```tsx
 * <LiveKitRoom>
 *   <RoomAudioRenderer />
 * </LiveKitRoom>
 * ```
 * @public
 */

export function RoomAudioRenderer() {
  const rf = useReactFlow();

  const { user } = useAuth();

  const tracks = useTracks(
    [
      Track.Source.Microphone,
      Track.Source.ScreenShareAudio,
      Track.Source.Unknown,
    ],
    {
      updateOnlyOn: [],
      onlySubscribed: true,
    }
  ).filter(
    (ref) =>
      !isLocal(ref.participant) && ref.publication.kind === Track.Kind.Audio
  );

  return (
    <div style={{ display: "none" }}>
      {tracks.map((trackRef) => {
        if (!user) return;

        const myUserNode = rf.getNode(user?.username);

        if (myUserNode === undefined) return;

        const trackOwner = rf.getNode(trackRef?.participant?.identity);

        if (trackOwner === undefined) return;

        const { meet } = doCirclesMeetRaw(
          46,
          VARZ.voiceAreaRadius,
          myUserNode.position,
          trackOwner.position
        );

        let volume = 0;
        let isMuted = !meet;

        if (meet) volume = 1;

        return (
          <AudioTrack
            key={getTrackReferenceId(trackRef)}
            trackRef={trackRef}
            volume={volume}
            muted={isMuted}
          />
        );
      })}
    </div>
  );
}

const DEFAULT_X = 0;
const DEFAULT_Y = 0;

export function doCirclesMeet(
  circle1?: UserMinimalType | WorkspaceUserType,
  circle2?: UserMinimalType | WorkspaceUserType
) {
  if (!circle2 || !circle1)
    return {
      distance: undefined,
      meet: false,
      volumePercentage: 0,
    };

  const radius = 46; // radius of each circle
  const radiusHearing = VARZ.voiceAreaRadius - 50;

  const userCoordinate1 = circle1.coordinates?.split(",")?.map((x) => +x) ?? [
    DEFAULT_X,
    DEFAULT_Y,
  ];
  const user1Position = { x: userCoordinate1[0], y: userCoordinate1[1] };
  const userCoordinate2 = circle2.coordinates?.split(",")?.map((x) => +x) ?? [
    DEFAULT_X,
    DEFAULT_Y,
  ];
  const user2Position = { x: userCoordinate2[0], y: userCoordinate2[1] };

  // Calculate the distance between the centers of the circles
  const distance = Math.sqrt(
    Math.pow(user1Position.x - user2Position.x, 2) +
      Math.pow(user1Position.y - user2Position.y, 2) // Fixed y-coordinate difference calculation
  );

  // Check if the distance is less than or equal to the sum of the radii
  const meet = distance <= 2 * radius + radiusHearing;

  const percentage = !meet
    ? 0
    : 100 - Math.min((distance / radiusHearing) * 100, 100);

  return { meet, distance, volumePercentage: percentage };
}

export function doCirclesMeetRaw(
  radius: number,
  area: number,
  circle1: { x: number; y: number },
  circle2: { x: number; y: number }
) {
  const radiusHearing = area - (radius + 4);

  // Calculate the distance between the centers of the circles
  const distance = Math.sqrt(
    Math.pow(circle1.x - circle2.x, 2) + Math.pow(circle1.y - circle2.y, 2) // Fixed y-coordinate difference calculation
  );

  // Check if the distance is less than or equal to the sum of the radii
  const meet = distance <= 2 * radius + radiusHearing;

  const percentage = !meet
    ? 0
    : 100 - Math.min((distance / radiusHearing) * 100, 100);

  return { meet, distance, volumePercentage: percentage };
}
