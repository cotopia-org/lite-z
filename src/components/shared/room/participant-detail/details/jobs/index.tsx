import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import CotopiaTooltip from "@/components/shared-ui/c-tooltip";
import { BriefcaseBusiness } from "lucide-react";
import { __BUS } from "@/const/bus";
import ModalBox from "@/components/shared/modal-box";
import UserJobList from "./user-jobs";
import { useUserDetail } from "..";

interface Props {}

const UserJobs = (props: Props) => {
  const { user } = useUserDetail();

  return (
    <ModalBox
      hasClose={false}
      trigger={(open) => (
        <CotopiaTooltip title='User jobs'>
          <CotopiaIconButton
            onClick={open}
            size={"icon"}
            className='text-black w-6 h-6'
          >
            <BriefcaseBusiness size={16} />
          </CotopiaIconButton>
        </CotopiaTooltip>
      )}
      className='w-auto'
    >
      {(open, close) => {
        return <UserJobList userId={user?.id as number} />;
      }}
    </ModalBox>
  );
};

export default UserJobs;
