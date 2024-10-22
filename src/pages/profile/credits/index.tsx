import NormalPageHolder from "@/components/containers/normal-page-holder";
import AddCreditButton from "./add-credit-button";
import CreditsListWithFilters from "./list-with-filters";

export default function ProfileCreditsPage() {
  return (
    <NormalPageHolder
      title='لیست کدهای اعتبار'
      actionNode={<AddCreditButton />}
    >
      <CreditsListWithFilters />
    </NormalPageHolder>
  );
}
