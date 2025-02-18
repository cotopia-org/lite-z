import { VARZ } from '@/const/varz';
import { useAppSelector } from '@/store';
import { LiveKitRoom } from '@livekit/components-react';
import { ReactNode } from 'react';
import MediaContextProvider from '../room/media-context';
import { usePermissionContext } from '@/pages/workspace/permission-context';

type Props = {
  children: ReactNode;
  disconnect: boolean;
};
export default function LivekitRefactored({ children, disconnect }: Props) {
  const { token } = useAppSelector((store) => store.livekit);

  const { permissions } = usePermissionContext();

  if (disconnect) return children;

  return (
    //@ts-ignore
    <LiveKitRoom
      serverUrl={VARZ.serverUrl}
      token={token}
      connect={true}
      video={permissions.video}
      audio={permissions.audio}
      options={{
        adaptiveStream: {
          pixelDensity: 'screen',
        },
        publishDefaults: {
          screenShareEncoding: {
            maxBitrate: 100_000_000,
            maxFramerate: 15,
          },
          videoCodec: 'av1',
          dtx: true,
        },
      }}
    >
      <MediaContextProvider>{children}</MediaContextProvider>
    </LiveKitRoom>
  );
}
