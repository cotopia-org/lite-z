import CotopiaTable from "@/components/shared-ui/c-table";
import { PaymentType } from "@/types/payment";
import { useRoomContext } from "../../room/room-context";

type Props = {
  endpoint: string;
  status?: string;
};
export default function UserPayments({ endpoint, status }: Props) {
  const { payments } = useRoomContext();

  return (
    <CotopiaTable
      items={payments.filter((a) => a.status === status)}
      tableHeadItems={[
        // { title: "Id", render: (item: PaymentType) => item.id },
        // {
        //   title: "Username",
        //   render: (item: PaymentType) => item.user.username,
        // },
        // {
        //   title: "User",
        //   render: (item: PaymentType) => {
        //     const user = workspaceUsers.find((x) => x.id === item.user.id);

        //     if (user === undefined) return null;

        //     return <ParticipantsWithPopover participants={[user]} />;
        //   },
        // },
        {
          title: "Total hours",
          render: (item: PaymentType) => item.total_hours?.sum_hours,
        },
        // {
        //   title: "Bonus",
        //   render: (item: PaymentType) => item.bonus,
        // },
        // {
        //   title: "Round",
        //   render: (item: PaymentType) => item.round,
        // },
        {
          title: "Amount",
          render: (item: PaymentType) => item.amount.toFixed(1),
        },
        {
          title: "Status",
          render: (item: PaymentType) => item.status,
        },
      ]}
    />
  );
}
