import React from 'react';
import ActionsRight from './actions-right';
import MicButton from './actions-right/mic';
import { useParticipantTileCtx } from '../participant-tile-provider';
import { Track } from 'livekit-client';
import { TrackReferenceOrPlaceholder } from '@livekit/components-core';
import { UserMinimalType } from '@/types/user';

interface Props {}

const RfUserTileActions = (props: Props) => {
  const { trackRef, targetUser } = useParticipantTileCtx();

  const trackReference = trackRef as TrackReferenceOrPlaceholder;
  return (
    <ActionsRight>
      <MicButton
        targetUser={targetUser as UserMinimalType}
        trackRef={{
          participant: trackReference?.participant,
          source: Track.Source.Microphone,
        }}
        forceMuted={
          trackReference?.participant?.identity !== targetUser?.username
        }
      />
    </ActionsRight>
  );
};

export default RfUserTileActions;
