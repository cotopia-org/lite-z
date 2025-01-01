import CotopiaButton from '@/components/shared-ui/c-button';
import PopupBox from '@/components/shared/popup-box';
import PopupBoxChild from '@/components/shared/popup-box/child';
import ToolButton from '../../tool-button';
import ExpectedPayments from './expected-payments';
import CTabs from '@/components/shared-ui/c-tabs';
import CFullDialog from '@/components/shared-ui/c-dialog/full-dialog';
import PayrollPage from '@/pages/cotopia-payroll/user/payroll';
import { Check, Coins } from 'lucide-react';
import useAuth from '@/hooks/auth';
import { useRoomContext } from '../../../room-context';
import CotopiaTable from '@/components/shared-ui/c-table';
import { UserContractType } from '@/types/contract';
import moment from 'moment';
import UserPayments from '@/components/shared/cotopia-payroll/payments';
import { useMemo } from 'react';
import NotFound from '@/components/shared/layouts/not-found';
import ContractDetails from './contract-details';
import { useApi } from '@/hooks/use-api';
import ContractStatus from './contract-status';

const box_width = 506;

export default function PayrollButton() {
  const { user } = useAuth();
  const { workspaceUsers, payments } = useRoomContext();

  const myUser = workspaceUsers?.find((a) => a.id === user?.id);

  const totalPendingPaymentsAmount = useMemo(() => {
    return payments
      .filter((a) => a.status === 'ongoing')
      .reduce((prev, crt) => crt.amount + prev, 0);
  }, [payments]);

  const { data, isLoading, mutate } = useApi(`/users/me/contracts`);

  const contracts: UserContractType[] = data !== undefined ? data?.data : [];

  return (
    <PopupBox
      trigger={(open, isOpen) => (
        <div className="relative">
          {contracts?.filter((a) => a.status !== 'signed').length > 0 && (
            <div className="w-2 h-2 bg-red-500 rounded-full absolute top-2 right-2 z-10"></div>
          )}
          <ToolButton
            isOpen={isOpen}
            startIcon={<Coins size={20} />}
            open={open}
          >
            <ExpectedPayments amount={totalPendingPaymentsAmount} />
          </ToolButton>
        </div>
      )}
    >
      {(triggerPosition, open, close) => {
        return (
          <PopupBoxChild
            onClose={close}
            title="Payroll"
            width={box_width}
            zIndex={triggerPosition.zIndex}
            top={triggerPosition.top}
            left={triggerPosition.left - (box_width - triggerPosition.width)}
          >
            <div className="flex w-full flex-col gap-y-6 items-end">
              <CTabs
                defaultValue="active-contract"
                items={[
                  {
                    value: 'active-contract',
                    title: 'Contract',
                    content: (
                      <div className="py-3">
                        <div className="flex flex-col w-full my-4">
                          <CotopiaTable
                            loading={isLoading}
                            items={contracts}
                            tableHeadItems={[
                              {
                                title: 'Times',
                                render: (item: UserContractType) => (
                                  <div className="flex flex-col gap-y-2">
                                    <span>
                                      {moment(item.start_at).format(
                                        'YYYY/MM/DD',
                                      )}
                                    </span>
                                    <span>
                                      {moment(item.end_at).format('YYYY/MM/DD')}
                                    </span>
                                  </div>
                                ),
                              },
                              {
                                title: 'Per hour',
                                render: (item: UserContractType) =>
                                  `${item.amount} (${item.currency})`,
                              },
                              {
                                title: 'Status',
                                render: (item: UserContractType) => {
                                  return <ContractStatus contract={item} />;
                                },
                              },

                              {
                                title: '',
                                render: (item: UserContractType) => (
                                  <div className="flex flex-row items-center gap-1">
                                    <ContractDetails
                                      mutate={mutate}
                                      contract={item}
                                    />
                                  </div>
                                ),
                              },
                            ]}
                          />
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: 'Payments',
                    value: 'payments',
                    content: <UserPayments endpoint="/users/me/payments" />,
                  },
                ]}
              />
              <div className="w-full flex justify-end">
                <CFullDialog
                  trigger={(open) => (
                    <CotopiaButton
                      onClick={open}
                      className="bg-primary text-white rounded-xl mt-3"
                    >
                      More
                    </CotopiaButton>
                  )}
                >
                  {(close) => {
                    return <PayrollPage onClose={close} />;
                  }}
                </CFullDialog>
              </div>
            </div>
          </PopupBoxChild>
        );
      }}
    </PopupBox>
  );
}
