import RoomContext, {
  EasyRoomContext,
} from '@/components/shared/room/room-context';
import Dashboard from '@/pages/dashboard';

export default function WorkspaceRoomJobsPage() {
  const handleBack = () => {
    window.close();
  };

  return (
    <EasyRoomContext>
      <Dashboard onClose={handleBack} defaultPage={'users'} />
    </EasyRoomContext>
  );
}
