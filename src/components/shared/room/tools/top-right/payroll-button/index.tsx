import PopupBox from '@/components/shared/popup-box';
import PopupBoxChild from '@/components/shared/popup-box/child';
import ToolButton from '../../tool-button';
import ExpectedPayments from './expected-payments';
import CTabs from '@/components/shared-ui/c-tabs';
import { Coins } from 'lucide-react';
import { useRoomContext } from '../../../room-context';
import CotopiaTable from '@/components/shared-ui/c-table';
import { UserContractType } from '@/types/contract';
import moment from 'moment';
import UserPayments from '@/components/shared/cotopia-payroll/payments';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import ContractDetails from './contract-details';
import ContractStatus from './contract-status';
import { useLoading } from '@/hooks';
import axiosInstance from '@/services/axios';
import { useSocket } from '@/routes/private-wrarpper';
import useAuth from '@/hooks/auth';
import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';

const box_width = 506;

const ContractsContext = createContext<{
  renderAgain: () => Promise<void>;
  contracts: UserContractType[];
  myContracts: UserContractType[];
  loading: boolean;
}>({
  renderAgain: async () => {},
  myContracts: [],
  contracts: [],
  loading: false,
});

export const useContractsCtx = () => useContext(ContractsContext);

export default function PayrollButton() {
  const { payments, workspace_id, room_id } = useRoomContext();

  const { user } = useAuth();

  const { isLoading, startLoading, stopLoading } = useLoading();

  const [contracts, setContracts] = useState<UserContractType[]>([]);

  const totalPendingPaymentsAmount = useMemo(() => {
    return payments
      .filter((a) => a.status === 'ongoing')
      .reduce((prev, crt) => crt.amount + prev, 0);
  }, [payments]);

  const getContracts = async () => {
    startLoading();
    try {
      const res = await axiosInstance.get(`/contracts`);
      stopLoading();
      const data = res?.data?.data ?? [];
      setContracts(data);
    } catch (err) {
      stopLoading();
    }
  };

  useEffect(() => {
    getContracts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //separate my contracts
  const my_contracts = contracts.filter((c) => c.user_id === user.id);

  useSocket(
    'contractCreated',
    (data) => {
      setContracts((crt) => [data, ...crt]);
    },
    [contracts],
  );

  // );
  useSocket(
    'contractUpdated',
    (data) => {
      let latest_contracts = [...contracts];
      const current_index = latest_contracts.findIndex((l) => l.id === data.id);
      latest_contracts[current_index] = data;
      if (current_index !== -1) setContracts(latest_contracts);
    },
    [contracts],
  );

  useSocket(
    'contractDeleted',
    (data) => {
      setContracts((crt) => crt.filter((c) => c.id !== data.id));
    },
    [contracts],
  );

  return (
    <PopupBox
      trigger={(open, isOpen) => (
        <div className="relative">
          {contracts.filter((a) => a.status !== 'signed').length > 0 && (
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
            <ContractsContext.Provider
              value={{
                contracts,
                myContracts: my_contracts,
                renderAgain: getContracts,
                loading: isLoading,
              }}
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
                              items={my_contracts}
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
                                        {moment(item.end_at).format(
                                          'YYYY/MM/DD',
                                        )}
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
                                      <ContractDetails contract={item} />
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
                      content: <UserPayments />,
                    },
                  ]}
                />
                <div className="w-full flex justify-end">
                  <Link
                    to={`/workspaces/${workspace_id}/rooms/${room_id}/payroll`}
                    className={buttonVariants({
                      variant: 'default',
                      class: 'bg-primary text-white rounded-xl mt-3',
                    })}
                    target="_blank"
                  >
                    More
                  </Link>
                </div>
              </div>
            </ContractsContext.Provider>
          </PopupBoxChild>
        );
      }}
    </PopupBox>
  );
}
