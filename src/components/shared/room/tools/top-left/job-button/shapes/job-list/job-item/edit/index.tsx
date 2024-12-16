import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import CotopiaTooltip from "@/components/shared-ui/c-tooltip";
import { FullModalBox } from "@/components/shared/modal-box";
import { JobType } from "@/types/job";
import ManageJobContent from "../../../add-job/content";
import { EditIcon } from "@/components/icons";
import { colors } from "@/const/varz";

type Props = {
  job: JobType;
  fetchAgain?: () => void;
  parentJobs: JobType[];
};
export default function EditJobButton({ job, fetchAgain, parentJobs }: Props) {
  return (
    <FullModalBox
      title="Edit Job"
      trigger={(open) => (
        <CotopiaTooltip title="Edit Job">
          <CotopiaIconButton
            onClick={open}
            className="hover:text-black w-5 h-5"
          >
            <EditIcon color={colors.grayscale.subtitle} size={16} />
          </CotopiaIconButton>
        </CotopiaTooltip>
      )}
      className="w-auto min-w-[440px] [&_.dialog-title]:text-lg [&_.dialog-header]:pb-4 [&_.dialog-header]:border-b"
    >
      {(open, close) => (
        <ManageJobContent
          parentJobs={parentJobs}
          onClose={close}
          defaultValue={job}
          onCreated={() => {
            if (fetchAgain) fetchAgain();
            close();
          }}
          onDelete={() => {
            if (fetchAgain) fetchAgain();
            close();
          }}
        />
      )}
    </FullModalBox>
  );
}
