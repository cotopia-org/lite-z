import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Triangle, TriangleAlert } from 'lucide-react';
import InsertButton from './insert-button';
import useAuth from '@/hooks/auth';
import { UserContractType } from '@/types/contract';
import { useEffect, useState } from 'react';
import { isUserAdmin } from '@/lib/utils';
import { useRoomContext } from '@/components/shared/room/room-context';

type Props = {
  contract: UserContractType;
  onUpdate?: (contract: UserContractType) => void;
};

export default function HintAddressContract({ contract, onUpdate }: Props) {
  const { user } = useAuth();
  const { workspace_id } = useRoomContext();

  const userIsAdmin = isUserAdmin(user, workspace_id);

  const [localContract, setLocalContract] = useState(contract);
  useEffect(() => {
    if (contract !== undefined) setLocalContract(contract);
  }, [contract]);

  if (!localContract) return null;

  if (localContract?.payment_address) return null;

  if (localContract?.user_id !== user?.id) {
    if (userIsAdmin)
      return (
        <Alert className="text-yellow-600 [&_svg]:text-yellow-600">
          <TriangleAlert className="h-4 w-4 " />
          <AlertTitle>{'Warning'}</AlertTitle>
          <AlertDescription>
            {`User should add a payment address for this contract!`}
          </AlertDescription>
        </Alert>
      );
    return null;
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription className="mb-2">
        You didn't set a payment address for this contract!
      </AlertDescription>
      <InsertButton contract={localContract} onUpdate={onUpdate} />
    </Alert>
  );
}
