import CotopiaButton from '@/components/shared-ui/c-button';
import CDialog from '@/components/shared-ui/c-dialog';
import useAuth from '@/hooks/auth';
import { isUserAdmin } from '@/lib/utils';
import PayrollCreateContract from '@/pages/cotopia-payroll/admin/create-contract';
import { UserContractType } from '@/types/contract';
import { Edit } from 'lucide-react';
import { useRoomContext } from '../../../room-context';

type Props = {
  contract: UserContractType;
  onUpdate?: (contract: UserContractType) => void;
};

export default function EditContract({ contract, onUpdate }: Props) {
  // const { workspace_id } = useRoomContext();
  //
  // const { user } = useAuth();

  // const userIsAdmin = isUserAdmin(user, +(workspace_id as string));
  //
  // if (!userIsAdmin) return null;

  return (
    <CDialog
      trigger={(open) => (
        <CotopiaButton
          onClick={open}
          variant={'link'}
          endIcon={<Edit size={16} />}
        >
          Edit
        </CotopiaButton>
      )}
      dialogContentCss="w-[800px] max-w-full max-h-screen md:max-h-[calc(100vh-64px)] overflow-y-auto"
    >
      {(close) => (
        <PayrollCreateContract
          defaultContract={contract}
          onUpdate={onUpdate}
          onBack={close}
        />
      )}
    </CDialog>
  );
}
