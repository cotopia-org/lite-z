import { cn } from '@/lib/utils';
import { UserContractType } from '@/types/contract';

type Props = {
  contract: UserContractType;
};
export default function ContractStatus({ contract }: Props) {
  let clss =
    'py-1 px-4 capitalize text-center font-bold text-white border whitespace-nowrap rounded-md';
  switch (contract.status) {
    case 'expired':
      clss = cn(clss, 'bg-red-500');
      break;
    case 'active':
      clss = cn(clss, 'bg-green-500');
      break;
    case 'draft':
    case 'waiting_admin_sign':
    case 'waiting_user_sign':
      clss = cn(clss, 'bg-yellow-500');
      break;
    default:
      clss = cn(clss, 'bg-cyan-500');
  }

  return <div className={clss}>{contract.status.replaceAll('_', ' ')}</div>;
}
