import CotopiaButton from "@/components/shared-ui/c-button";
import CotopiaTable from "@/components/shared-ui/c-table";
import ContractDetailsById from "@/components/shared/cotopia-payroll/user-information/user-contract/contract-details/view-by-id";
import ParticipantsWithPopover from "@/components/shared/participants/with-popover";
import { useRoomContext } from "@/components/shared/room/room-context";
import { useApi } from "@/hooks/swr";
import { PaymentType } from "@/types/payment";
import { ChevronLeft, ChevronRight, Pencil, Plus, X } from "lucide-react";
import { ReactNode, useMemo, useState } from "react";
import {
  formatTime,
  getContractStatus,
  getDateTime,
  urlWithQueryParams,
} from "@/lib/utils";
import TitleEl from "@/components/shared/title-el";
import { JobType, UserJobType } from "@/types/job";
import CotopiaDropdown from "@/components/shared-ui/c-dropdown";
import CPagination from "@/components/shared-ui/c-pagination";
import ParticipantDetails from "@/components/shared/room/participant-detail";
import CotopiaAvatar from "@/components/shared-ui/c-avatar";
import { UserType, WorkspaceUserType } from "@/types/user";
import JobStatus from "@/components/shared/room/tools/top-left/job-button/shapes/job-list/job-item/job-status";
import { colors, VARZ } from "@/const/varz";
import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import JobTag from "@/components/shared/room/tools/top-left/job-button/shapes/job-list/job-item/tag";
import { TrashIcon } from "@/components/icons";
import PropmptBox from "@/components/shared/prompt-box";
import StatusBox from "@/components/shared/status-box";
import CotopiaMention from "@/components/shared-ui/c-mention";

type Props = {
  header: ReactNode;
  main: ReactNode;
};

export default function Page({ header, main }: Props) {
  return (
    <div className={" w-full flex flex-col p-4"}>
      <div
        className={
          "w-full flex flex-row  justify-between items-center border p-4"
        }
      >
        {header}
      </div>
      <div className={"flex w-full flex-row  justify-between border p-4"}>
        {main}
      </div>
    </div>
  );
}
