import { EasyRoomContext } from '@/components/shared/room/room-context';
import PayrollPage from '@/pages/cotopia-payroll/user/payroll';

export default function WorkspacePayrollPage() {
  const handleClose = () => {
    window.close();
  };

  return (
    <EasyRoomContext>
      <PayrollPage onClose={handleClose} />
    </EasyRoomContext>
  );
}
