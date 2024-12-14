import CotopiaButton from "@/components/shared-ui/c-button";
import CotopiaTable from "@/components/shared-ui/c-table";
import ContractDetailsById from "@/components/shared/cotopia-payroll/user-information/user-contract/contract-details/view-by-id";
import ParticipantsWithPopover from "@/components/shared/participants/with-popover";
import { useRoomContext } from "@/components/shared/room/room-context";
import { useApi } from "@/hooks/swr";
import { PaymentType } from "@/types/payment";
import { ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { getContractStatus } from "@/lib/utils";
import TitleEl from "@/components/shared/title-el";
import { JobType } from "@/types/job";
import CotopiaDropdown from "@/components/shared-ui/c-dropdown";

type Props = {
  isAll?: boolean;
};

export default function Jobs({ isAll = true }: Props) {
  const [selectStatus, setSelectStatus] = useState<string>();

  const { workspaceUsers, workspace_id } = useRoomContext();

  const { data, mutate } = useApi(`/workspaces/${workspace_id}/jobs`);
  const jobs: JobType[] = data !== undefined ? data?.data : [];

  let finalJobs = jobs.sort((a, b) => b.id - a.id);

  if (selectStatus)
    finalJobs = finalJobs.filter((a) => a.status === selectStatus);

  const tableHeadItems = useMemo(() => {
    const items = [
      {
        title: "#",
        render: (item: JobType) => {
          return item.id;
        },
      },
      {
        title: "User",
        render: (item: JobType) => {
          return (
            <ParticipantsWithPopover
              className="!pb-0"
              participants={workspaceUsers.filter((a) =>
                item.members.map((b) => b.id).includes(a.id),
              )}
            />
          );
        },
      },

      {
        title: "Title",
        render: (item: JobType) => {
          return <>{item.title}</>;
        },
      },

      {
        title: "Total Hours",
        render: (item: JobType) =>
          (
            item.members.reduce((sum, a) => sum + a.total_minutes, 0) / 60
          ).toFixed(2) + " hrs",
      },
      //
      // {
      //   title: "Payment",
      //   render: (item: PaymentType) => {
      //     return (
      //       <CotopiaButton
      //         variant={"link"}
      //         endIcon={<ChevronRight />}
      //         onClick={() => setSelectedPayment(item)}
      //       >
      //         Details
      //       </CotopiaButton>
      //     );
      //   },
      // },
      {
        title: "Status",
        render: (item: JobType) => {
          return <>{item.status}</>;
        },
      },
    ];

    return items;
  }, [isAll]);

  // if (selectedPayment)
  //   return (
  //     <PayrollCreatePayments
  //       onBack={() => setSelectedPayment(undefined)}
  //       defaultValue={selectedPayment}
  //     />
  //   );

  return (
    <>
      <div className="flex flex-row items-center gap-x-4">
        <CotopiaDropdown
          label="Job Status"
          items={[
            { title: "All", value: "all" },
            { title: "In Progress", value: "in_progress" },
            {
              title: "Paused",
              value: "paused",
            },
            { title: "Completed", value: "completed" },
          ]}
          onSelect={(item) =>
            setSelectStatus(item.value === "all" ? undefined : item.value)
          }
        />
      </div>
      <CotopiaTable items={finalJobs} tableHeadItems={tableHeadItems} />
    </>
  );
}
