import { useEffect } from 'react';
import { useRoomContext as useLocalRoomContext } from '../room-context';
import RoomSidebar from '../sidebar';
import RoomSettings from '../settings';
import LiveKitAudioManager from '../components/audio-manager';
import InitRoom from './init-room';
import CanvasBoard from '../../canvas-board';
import { useAppSelector } from '@/store';
import { useRoomContext } from '@livekit/components-react';
import { VARZ } from '@/const/varz';
import { useRoomContext as localUseRoomContext } from './../room-context';
import GridRoomView from '../grid-room-view';
import FullLoading from '../../full-loading';
import { cn } from '@/lib/utils';
import { isMobileBrowser } from '@livekit/components-core';
import { useSocket } from '@/routes/private-wrarpper';
import { UserMinimalType } from '@/types/user';
import useAuth from '@/hooks/auth';
import { useMediaContext } from '../media-context';
import { __BUS } from '@/const/bus';
import { dispatch } from 'use-bus';
import { usePermissionContext } from '@/pages/workspace/permission-context';

export default function RoomInner() {
  const { user: profile } = useAuth();
  const { disconnect, connect } = useRoomContext();
  const { room, roomLoading } = localUseRoomContext();
  const { voiceOff, audioTrack } = useMediaContext();
  const { resetStreamHandler } = usePermissionContext();

  const isMobile = isMobileBrowser();

  let is_grid_view = room?.type === 'grid';
  let is_flow_view = room?.type === 'flow';

  const { token } = useAppSelector((store) => store.livekit);

  useEffect(() => {
    async function init() {
      if (token) {
        disconnect();
        await connect(VARZ.serverUrl as string, token);
      }
    }
    init();
  }, [token]);

  useSocket(
    'toggleHardMuted',
    (user: UserMinimalType) => {
      const is_mine = user.id === profile.id;
      const hard_muted = user.hard_muted;
      if (is_mine) {
        if (hard_muted) {
          voiceOff();
          audioTrack?.mute();
          audioTrack?.stop();
        } else {
          resetStreamHandler();
        }
      }
      dispatch(__BUS.refreshNodeAudio);
    },
    [audioTrack, resetStreamHandler, voiceOff],
  );

  const { sidebar } = useLocalRoomContext();

  let mainRoomHolderClss = 'main-room-holder w-full h-screen overflow-hidden';
  if (sidebar) mainRoomHolderClss += ' pr-[376px]';

  let view = null;
  if (is_grid_view && !roomLoading) {
    view = <GridRoomView />;
  }
  if (is_flow_view && !roomLoading) {
    view = <CanvasBoard />;
  }
  if (roomLoading) {
    view = <FullLoading />;
  }

  let parentSidebarClass = cn(
    'fixed right-0 top-0 bottom-0 w-full md:w-[376px] h-screen overflow-y-auto z-10',
    isMobile ? 'top-[64px] border-t bg-black' : 'bg-white',
  );

  return (
    <>
      <InitRoom />
      <div id="main-room-holder" className={mainRoomHolderClss}>
        <div className="w-full h-full relative">{view}</div>
        {!!sidebar && (
          <div className={parentSidebarClass}>
            <RoomSidebar>
              <RoomSettings />
            </RoomSidebar>
          </div>
        )}
        <LiveKitAudioManager />
      </div>
    </>
  );
}
