import CotopiaButton from "@/components/shared-ui/c-button";
import CotopiaTable from "@/components/shared-ui/c-table";
import ContractDetailsById from "@/components/shared/cotopia-payroll/user-information/user-contract/contract-details/view-by-id";
import ParticipantsWithPopover from "@/components/shared/participants/with-popover";
import { useRoomContext } from "@/components/shared/room/room-context";
import { useApi } from "@/hooks/swr";
import { PaymentType } from "@/types/payment";
import { ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import PaymentStatus from "./payment-status";

type Props = {
  isAll?: boolean;
};

export default function Payments({ isAll = true }: Props) {
  const [selectedContractId, setSelectedContractId] = useState<number>();

  const { workspaceUsers } = useRoomContext();

  const { data } = useApi(isAll ? `/payments` : `/users/me/payments`);
  const payments: PaymentType[] = data !== undefined ? data?.data : [];

  const tableHeadItems = useMemo(() => {
    const items = [
      { title: "Id", render: (item: PaymentType) => item.id },
      {
        title: "Total Hours",
        render: (item: PaymentType) => item.total_hours.sum_hours,
      },
      {
        title: "User",
        render: (item: PaymentType) => {
          const participant = workspaceUsers.find((a) => a.id === item.user.id);

          if (participant === undefined) return null;

          return (
            <ParticipantsWithPopover
              className='pb-0'
              participants={[participant]}
            />
          );
        },
      },
      { title: "Type", render: (item: PaymentType) => item.type },
      { title: "Bonus", render: (item: PaymentType) => item.bonus },
      { title: "Amount", render: (item: PaymentType) => item.amount },
      { title: "Round", render: (item: PaymentType) => item.round },
      {
        title: "Contract",
        render: (item: PaymentType) => {
          return (
            <CotopiaButton
              variant={"link"}
              endIcon={<ChevronRight />}
              onClick={() => setSelectedContractId(item.id)}
            >
              Details
            </CotopiaButton>
          );
        },
      },
    ];

    if (isAll) {
      items.push({
        title: "Status",
        render: (item: PaymentType) => <PaymentStatus payment={item} />,
      });
    } else {
      items.push({
        title: "Status",
        render: (item: PaymentType) => (
          <span className='capitalize'>{item.status}</span>
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

  return <CotopiaTable items={payments} tableHeadItems={tableHeadItems} />;

  // return (
  // <PayrollTable<PaymentsRowData>
  //   rowData={payments}
  //   colData={paymentsColDefs}
  // />
  // );
}
