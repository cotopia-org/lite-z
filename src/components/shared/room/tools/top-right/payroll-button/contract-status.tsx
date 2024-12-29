import { cn } from '@/lib/utils';
import { UserContractType } from '@/types/contract';

type Props = {
  contract: UserContractType;
};
export default function ContractStatus({ contract }: Props) {
  let clss = 'py-1 px-4 capitalize border whitespace-nowrap rounded-md';
  switch (contract.status) {
    case 'draft':
    case 'waiting_admin_sign':
    case 'waiting_user_sign':
      clss = cn(clss, 'bg-yellow-200 text-black');
      break;
    default:
      clss = cn(clss, 'bg-green-200 text-green');
  }

  return <div className={clss}>{contract.status.replaceAll('_', ' ')}</div>;
}
