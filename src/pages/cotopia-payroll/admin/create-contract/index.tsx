import { UserContractType } from '@/types/contract';
import ManageContract from './edit-2';

type Props = {
  defaultContract?: UserContractType;
  onBack?: () => void;
  onUpdate?: () => void;
};

export default function PayrollCreateContract({
  defaultContract,
  onBack,
  onUpdate,
}: Props) {
  if (defaultContract)
    return (
      <ManageContract
        onBack={onBack}
        onUpdate={onUpdate}
        defaultContract={defaultContract}
      />
    );

  return <ManageContract />;
}
