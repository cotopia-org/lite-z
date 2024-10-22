import NormalPageHolder from "@/components/containers/normal-page-holder";
import AddPersonnelButton from "./add-personnel-button";
import PersonnelListWithFilters from "./list-with-filters";
import { dispatch } from "use-bus";
import { __BUS } from "@/const/bus";
import { useCallback } from "react";

export default function PersonnelPage() {
  const handleAddNewPersonnel = useCallback(() => {
    dispatch(__BUS.mutateTableAgain);
  }, []);

  return (
    <NormalPageHolder
      title="لیست پرسنل"
      actionNode={<AddPersonnelButton onAdd={handleAddNewPersonnel} />}
    >
      <PersonnelListWithFilters />
    </NormalPageHolder>
  );
}
