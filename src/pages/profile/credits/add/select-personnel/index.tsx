import ModalContentWrapper from "@/components/partials/modal/content-wrapper";
import { OrgButton } from "@/components/shared-ui";
import ORawDialog from "@/components/shared-ui/o-dialog/raw-dialog";
import { PersonAutocompleteType } from "@/types/person";
import Content from "./content";

type Props = {
  defaultItems?: PersonAutocompleteType[];
  onSave: (items: PersonAutocompleteType[], type: "all" | "partials") => void;
};
export default function SelectPersonnel({ defaultItems, onSave }: Props) {
  return (
    <div>
      <ORawDialog
        trigger={(open) => (
          <OrgButton onClick={open} variant={"outline"}>
            انتخاب پرسنل
          </OrgButton>
        )}
      >
        {(close) => (
          <ModalContentWrapper onClose={close} title='انتخاب پرسنل'>
            <Content
              defaultItems={defaultItems ?? []}
              onCancel={close}
              onSave={onSave}
            />
          </ModalContentWrapper>
        )}
      </ORawDialog>
    </div>
  );
}
