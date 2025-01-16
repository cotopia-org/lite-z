import PayrollSideBar from '@/components/shared/cotopia-payroll/side-bar';
import { useRoomContext } from '@/components/shared/room/room-context';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLoading } from '@/hooks';
import useAuth from '@/hooks/auth';
import axiosInstance from '@/services/axios';
import { UserContractType } from '@/types/contract';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface Props {
  children: ReactNode;
}

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

export default function PayrollWrapper({ children }: Props) {
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
  const my_contracts = contracts.filter((c) => c?.user_id === user?.id);

  return (
    <ContractsContext.Provider
      value={{
        contracts,
        myContracts: my_contracts,
        renderAgain: getContracts,
        loading: isLoading,
      }}
    >
      <main className="w-full min-h-screen flex gap-x-2">
        <PayrollSideBar />
        <ScrollArea className="h-screen flex flex-col gap-y-4 w-full py-3">
          {children}
        </ScrollArea>
      </main>
    </ContractsContext.Provider>
  );
}
