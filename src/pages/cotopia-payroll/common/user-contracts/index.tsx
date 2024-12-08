import CotopiaButton from "@/components/shared-ui/c-button";
import CotopiaTable from "@/components/shared-ui/c-table";
import PayrollContractDetails from "@/components/shared/cotopia-payroll/user-information/user-contract/contract-details";
import ParticipantsWithPopover from "@/components/shared/participants/with-popover";
import { useRoomContext } from "@/components/shared/room/room-context";
import { UserContractType } from "@/types/contract";
import { ChevronRight } from "lucide-react";
import moment from "moment";
import { useState } from "react";

type Props = {
  items: UserContractType[];
  loading?: boolean;
};
export default function UserContracts({ items, loading }: Props) {
  const [selectedContract, setSelectedContract] = useState<UserContractType>();

  const { workspaceUsers } = useRoomContext();

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
          title: "Id",
          render: (item: UserContractType) => item.id,
        },
        {
          title: "User",
          render: (item: UserContractType) => {
            const user = workspaceUsers.find((a) => a.id === item.id);

            if (user === undefined) return null;

            return (
              <ParticipantsWithPopover
                participants={[user]}
                className='!pb-0'
              />
            );
          },
        },
        {
          title: "Type",
          render: (item: UserContractType) => item.type,
        },
        {
          title: "Amount",
          render: (item: UserContractType) => item.amount,
        },
        {
          title: "Min hours",
          render: (item: UserContractType) => item.min_hours,
        },
        {
          title: "Max hours",
          render: (item: UserContractType) => item.max_hours,
        },
        {
          title: "Payment Method",
          render: (item: UserContractType) => item.payment_method,
        },
        {
          title: "Starts At",
          render: (item: UserContractType) =>
            moment(item.start_at).format("YYYY/MM/DD"),
        },
        {
          title: "Ends At",
          render: (item: UserContractType) =>
            moment(item.end_at).format("YYYY/MM/DD"),
        },
        {
          title: "",
          render: (item: UserContractType) => (
            <CotopiaButton
              variant={"link"}
              endIcon={<ChevronRight size={16} />}
              onClick={() => setSelectedContract(item)}
            >
              Details
            </CotopiaButton>
          ),
        },
      ]}
    />
  );
}
