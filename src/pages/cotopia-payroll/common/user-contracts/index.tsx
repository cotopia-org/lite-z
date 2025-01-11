import CotopiaButton from '@/components/shared-ui/c-button';
import CotopiaTable from '@/components/shared-ui/c-table';
import PayrollContractDetails from '@/components/shared/cotopia-payroll/user-information/user-contract/contract-details';
import ParticipantsWithPopover from '@/components/shared/participants/with-popover';
import { useRoomContext } from '@/components/shared/room/room-context';
import EditContract from '@/components/shared/room/tools/top-right/payroll-button/edit-contract';
import { UserContractType } from '@/types/contract';
import { ChevronRight, Trash } from 'lucide-react';
import moment from 'moment';
import { useCallback, useState } from 'react';
import { useLoading } from '@/hooks';
import FullLoading from '@/components/shared/full-loading';
import axiosInstance from '@/services/axios';
import ContractStatus from '@/components/shared/room/tools/top-right/payroll-button/contract-status';

type Props = {
  items: UserContractType[];
  loading?: boolean;
};
export default function UserContracts({ items, loading }: Props) {
  const [selectedContract, setSelectedContract] = useState<UserContractType>();

  const { isLoading, startLoading, stopLoading } = useLoading();
  const { workspaceUsers } = useRoomContext();

  const handleDelete = useCallback(
    (item: UserContractType) => {
      startLoading();
      axiosInstance
        .delete(`/contracts/${item.id}`)
        .then((res) => {
          stopLoading();
        })
        .catch((e) => {
          stopLoading();
        });
    },
    [startLoading, stopLoading],
  );

  if (selectedContract) {
    return (
      <PayrollContractDetails
        onBack={() => setSelectedContract(undefined)}
        contract={selectedContract}
      />
    );
  }
  return (
    <CotopiaTable
      loading={loading}
      items={items}
      tableHeadItems={[
        {
          title: '#',
          render: (item: UserContractType) => {
            return item.id;
          },
        },
        {
          title: 'User',
          render: (item: UserContractType) => {
            const user = workspaceUsers.find((a) => a.id === item.user_id);

            if (user === undefined) return null;

            return (
              <ParticipantsWithPopover
                participants={[user]}
                className="!pb-0"
              />
            );
          },
        },
        {
          title: 'Type',
          render: (item: UserContractType) => item.type,
        },
        {
          title: 'Amount',
          render: (item: UserContractType) => item.amount,
        },
        {
          title: 'Starts At',
          render: (item: UserContractType) =>
            moment(item.start_at).format('YYYY/MM/DD'),
        },
        {
          title: 'Ends At',
          render: (item: UserContractType) =>
            moment(item.end_at).format('YYYY/MM/DD'),
        },
        {
          title: 'Status',
          render: (item: UserContractType) => (
            <ContractStatus contract={item} />
          ),
        },
        {
          title: '',
          render: (item: UserContractType) => (
            <div className="flex flex-row items-center gap-x-2">
              <EditContract contract={item} />
              <CotopiaButton
                variant={'link'}
                endIcon={<ChevronRight size={16} />}
                onClick={() => setSelectedContract(item)}
              >
                Details
              </CotopiaButton>
            </div>
          ),
        },
        {
          title: '',
          render: (item: UserContractType) => (
            <div className="flex flex-row items-center gap-x-2">
              {isLoading ? (
                <FullLoading />
              ) : (
                <CotopiaButton
                  onClick={() => {
                    handleDelete(item);
                  }}
                  className={'text-red-500'}
                  variant={'link'}
                  endIcon={<Trash size={16} />}
                >
                  Delete
                </CotopiaButton>
              )}
            </div>
          ),
        },
      ]}
    />
  );
}
