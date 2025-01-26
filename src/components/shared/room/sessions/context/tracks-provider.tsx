import { TrackReferenceOrPlaceholder } from '@livekit/components-core';
import { useTracks } from '@livekit/components-react';
import { RoomEvent, Track } from 'livekit-client';
import { ReactNode, createContext, useContext } from 'react';

const AllTracksContext = createContext<{
  tracks: TrackReferenceOrPlaceholder[];
}>({ tracks: [] });

const TracksContextProvider = ({ children }: { children: ReactNode }) => {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.Microphone, withPlaceholder: false },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    {
      updateOnlyOn: [
        RoomEvent.ActiveSpeakersChanged,
        RoomEvent.Reconnected,
        RoomEvent.Reconnecting,
        RoomEvent.MediaDevicesChanged,
        RoomEvent.LocalTrackPublished,
        RoomEvent.TrackUnsubscribed,
      ],
      onlySubscribed: true,
    },
  );

  return (
    <AllTracksContext.Provider value={{ tracks }}>
      {children}
    </AllTracksContext.Provider>
  );
};

export const useAllTrackContext = () => useContext(AllTracksContext);

export default TracksContextProvider;
