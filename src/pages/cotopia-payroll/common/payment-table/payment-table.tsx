import CotopiaButton from '@/components/shared-ui/c-button';
import CotopiaTable from '@/components/shared-ui/c-table';
import ContractDetailsById from '@/components/shared/cotopia-payroll/user-information/user-contract/contract-details/view-by-id';
import ParticipantsWithPopover from '@/components/shared/participants/with-popover';
import { useRoomContext } from '@/components/shared/room/room-context';
import { useApi } from '@/hooks/swr';
import { PaymentType } from '@/types/payment';
import { ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import PaymentStatus from './payment-status';
import PayrollCreatePayments from '../../admin/create-payments';
import PaymentTab from './payment-tab';
import TitleEl from '@/components/shared/title-el';
import ContractDetails from '@/components/shared/room/tools/top-right/payroll-button/contract-details';
import ContractStatus from '@/components/shared/room/tools/top-right/payroll-button/contract-status';

type Props = {
  isAll?: boolean;
};

export default function Payments({ isAll = true }: Props) {
  const [selectStatus, setSelectStatus] = useState<string>();

  const [selectedPayment, setSelectedPayment] = useState<PaymentType>();

  const [selectedContractId, setSelectedContractId] = useState<number>();

  const { workspaceUsers } = useRoomContext();

  const { data, mutate } = useApi(isAll ? `/payments` : `/users/me/payments`);
  const payments: PaymentType[] = data !== undefined ? data?.data : [];

  let finalPayments = payments;

  if (selectStatus)
    finalPayments = finalPayments.filter((a) => a.status === selectStatus);

  const tableHeadItems = useMemo(() => {
    const items = [
      {
        title: 'User',
        render: (item: PaymentType) => {
          const participant = workspaceUsers.find((a) => a.id === item.user.id);

          if (participant === undefined) return null;
          return (
            <ParticipantsWithPopover
              className="!pb-0"
              participants={[participant]}
              render={(item, content) => (
                <div className="flex flex-row items-center gap-x-2">
                  {content}
                  {item.title}
                </div>
              )}
            />
          );
        },
      },
      {
        title: 'Total Hours',
        render: (item: PaymentType) => item.total_hours.sum_hours,
      },
      // { title: 'Type', render: (item: PaymentType) => item.type },
      // { title: 'Bonus', render: (item: PaymentType) => item.bonus },
      {
        title: 'Amount',
        render: (item: PaymentType) => item.amount.toFixed(2),
      },
      {
        title: 'Contract',
        render: (item: PaymentType) => {
          return <ContractDetails text="Contract" contract={item.contract} />;
        },
      },
      {
        title: 'Payment',
        render: (item: PaymentType) => {
          return (
            <CotopiaButton
              variant={'link'}
              endIcon={<ChevronRight />}
              onClick={() => setSelectedPayment(item)}
            >
              Details
            </CotopiaButton>
          );
        },
      },
      {
        title: 'Status',
        render: (item: PaymentType) => {
          return <span className="capitalize">{item.status}</span>;
        },
      },
      {
        title: 'Contract Status',
        render: (item: PaymentType) => {
          return <ContractStatus contract={item.contract} />;
        },
      },
    ];

    if (isAll) {
      items.push({
        title: 'Pay Status',
        render: (item: PaymentType) => (
          <PaymentStatus payment={item} onChange={mutate} />
        ),
      });
    } else {
      items.push({
        title: 'Pay Status',
        render: (item: PaymentType) => (
          <span className="capitalize">{item.status}</span>
        ),
      });
    }

    return items;
  }, [isAll]);

  if (selectedContractId)
    return (
      <ContractDetailsById
        onBack={() => setSelectedContractId(undefined)}
        contract_id={selectedContractId}
      />
    );

  if (selectedPayment)
    return (
      <PayrollCreatePayments
        onBack={() => setSelectedPayment(undefined)}
        defaultValue={selectedPayment}
      />
    );

  return (
    <>
      <div className="flex flex-row items-center gap-x-4">
        <PaymentTab
          onChange={(value) =>
            setSelectStatus(value === 'all' ? undefined : value)
          }
        />
        <TitleEl title="Total">
          {finalPayments.reduce((prev, crt) => crt.amount + prev, 0).toFixed(2)}
        </TitleEl>
      </div>
      <CotopiaTable items={finalPayments} tableHeadItems={tableHeadItems} />
    </>
  );

  // return (
  // <PayrollTable<PaymentsRowData>
  //   rowData={payments}
  //   colData={paymentsColDefs}
  // />
  // );
}
