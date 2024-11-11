import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import CotopiaTooltip from "@/components/shared-ui/c-tooltip";
import { BriefcaseBusiness } from "lucide-react";
import { useUserDetail } from "..";
import { capitalizeWords } from "@/lib/utils";
import ModalBox from "@/components/shared/modal-box";
import JobList from "./list";

export default function UserJobs() {
  const { user } = useUserDetail();

  let userLabel = user?.name;

  if (!!!userLabel) userLabel = user?.username;

  if (userLabel) userLabel = capitalizeWords(userLabel);

  const boxLabel = `${userLabel}'s Jobs`;

  console.log("boxLabel ", boxLabel);
  console.log("user_id ", user);
  return (
    <ModalBox
      hasClose={false}
      trigger={(open) => (
        <CotopiaTooltip title={boxLabel}>
          <CotopiaIconButton
            onClick={open}
            size={"icon"}
            className="text-black w-6 h-6"
          >
            <BriefcaseBusiness size={16} />
          </CotopiaIconButton>
        </CotopiaTooltip>
      )}
      className="w-[600px] max-h-[500px] overflow-y-scroll"
    >
      {(open, close) => {
        return <JobList />;
      }}
    </ModalBox>
  );
}
