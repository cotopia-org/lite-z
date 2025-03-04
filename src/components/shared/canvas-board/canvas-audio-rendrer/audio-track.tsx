import * as React from 'react';
import type { TrackReference } from '@livekit/components-core';
import { log } from '@livekit/components-core';
import { RemoteAudioTrack, RemoteTrackPublication } from 'livekit-client';
import { useEnsureTrackRef } from '@livekit/components-react';
import { useMediaTrackBySourceOrName } from './use-media-track-by-source-or-name';

/** @public */
export interface AudioTrackProps
  extends React.AudioHTMLAttributes<HTMLAudioElement> {
  /** The track reference of the track from which the audio is to be rendered. */
  trackRef?: TrackReference;

  onSubscriptionStatusChanged?: (subscribed: boolean) => void;
  /** Sets the volume of the audio track. By default, the range is between `0.0` and `1.0`. */
  volume?: number;
  /**
   * Mutes the audio track if set to `true`.
   * @remarks
   * If set to `true`, the server will stop sending audio track data to the client.
   * @alpha
   */
  muted?: boolean;
}

/**
 * The AudioTrack component is responsible for rendering participant audio tracks.
 * This component must have access to the participant's context, or alternatively pass it a `Participant` as a property.
 *
 * @example
 * ```tsx
 *   <ParticipantTile>
 *     <AudioTrack trackRef={trackRef} />
 *   </ParticipantTile>
 * ```
 *
 * @see `ParticipantTile` component
 * @public
 */
export const AudioTrack = /* @__PURE__ */ React.forwardRef<
  HTMLAudioElement,
  AudioTrackProps
>(function AudioTrack(
  {
    trackRef,
    onSubscriptionStatusChanged,
    volume,
    muted,
    ...props
  }: AudioTrackProps,
  ref,
) {
  const trackReference = useEnsureTrackRef(trackRef);

  const mediaEl = React.useRef<HTMLAudioElement>(null);
  React.useImperativeHandle(ref, () => mediaEl.current as HTMLAudioElement);

  const {
    elementProps,
    isSubscribed,
    track,
    publication: pub,
  } = useMediaTrackBySourceOrName(trackReference, {
    element: mediaEl,
    props,
  });

  React.useEffect(() => {
    onSubscriptionStatusChanged?.(!!isSubscribed);
  }, [isSubscribed, onSubscriptionStatusChanged]);

  React.useEffect(() => {
    if (track === undefined || volume === undefined) {
      return;
    }
    if (track instanceof RemoteAudioTrack) {
      track.setVolume(volume);
    } else {
      log.warn('Volume can only be set on remote audio tracks.');
    }
  }, [volume, track]);

  React.useEffect(() => {
    if (pub === undefined || muted === undefined) {
      return;
    }
    if (pub instanceof RemoteTrackPublication) {
      pub.setEnabled(!muted);
    } else {
      log.warn('Can only call setEnabled on remote track publications.');
    }
  }, [muted, pub, track]);

  return (
    <audio ref={mediaEl} {...elementProps} playsInline={true} autoPlay={true} />
  );
});
