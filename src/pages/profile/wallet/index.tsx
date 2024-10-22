import NormalPageHolder from "@/components/containers/normal-page-holder";
import { buttonVariants } from "@/components/ui/button";
import { paths } from "@/routes/paths";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import CreditOverview from "./credit-overview";

export default function WalletPage() {
  return (
    <NormalPageHolder title='کیف پول'>
      <CreditOverview
        afterNode={
          <Link
            to={paths.profile.wallet.increase}
            className={buttonVariants({
              variant: "default",
            })}
          >
            <Plus className='ml-2' />
            افزایش اعتبار
          </Link>
        }
      />
    </NormalPageHolder>
  );
}
