import ModalContentWrapper from "@/components/partials/modal/content-wrapper";
import { OrgButton } from "@/components/shared-ui";
import ORawDialog from "@/components/shared-ui/o-dialog/raw-dialog";
import { Lock } from "lucide-react";
import EditPassword from "../edit-password";

export default function EditPasswordButton() {
  return (
    <ORawDialog
      trigger={(open) => (
        <OrgButton
          onClick={open}
          className='rounded-md'
          variant={"outline"}
          startIcon={<Lock />}
        >
          تغییر رمز عبور
        </OrgButton>
      )}
    >
      {(close) => (
        <ModalContentWrapper title='تغییر رمز عبور' onClose={close}>
          <EditPassword onCancel={close} onChanged={close} />
        </ModalContentWrapper>
      )}
    </ORawDialog>
  );
}
