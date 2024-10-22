import ModalContentWrapper from "@/components/partials/modal/content-wrapper";
import { OrgButton } from "@/components/shared-ui";
import OCustomRawDialog from "@/components/shared-ui/o-dialog/custom-raw-dialog";
import ORawDialog from "@/components/shared-ui/o-dialog/raw-dialog";
import OrgList from "@/components/shared-ui/o-list";
import OPopover from "@/components/shared-ui/o-popover";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import AddPersonnel from "../add-personnel";
import { PersonType } from "@/types/person";

type Props = {
  onAdd?: (personnel: PersonType) => void;
};

export default function AddPersonnelButton({ onAdd }: Props) {
  const [type, setType] = useState<"single" | "group">();
  const handleSelectType = (type: "single" | "group") => setType(type);

  const handleCloseAdding = () => setType(undefined);

  return (
    <>
      <OPopover
        align='end'
        side='bottom'
        trigger={
          <OrgButton className='rounded-md' endIcon={<ChevronDown />}>
            افزودن پرسنل
          </OrgButton>
        }
        contentClassName='p-0 py-2'
      >
        <OrgList
          items={[
            { label: "فردی", value: "single" },
            { label: "گروهی", value: "group" },
          ]}
          //@ts-ignore
          onChange={handleSelectType}
        />
      </OPopover>
      <OCustomRawDialog
        open={type !== undefined}
        onOpenChange={(open) => open === false && handleCloseAdding()}
      >
        {type !== undefined && (
          <AddPersonnel
            type={type}
            onClose={handleCloseAdding}
            onAdded={onAdd}
          />
        )}
      </OCustomRawDialog>
    </>
  );
}
