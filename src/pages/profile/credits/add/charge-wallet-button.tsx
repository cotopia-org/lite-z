import { buttonVariants } from "@/components/ui/button";
import { paths } from "@/routes/paths";
import { Wallet } from "lucide-react";
import { Link } from "react-router-dom";

export default function ChargeWalletButton() {
  return (
    <Link
      to={`${paths.profile.index}/${paths.profile.wallet.index}/${paths.profile.wallet.increase}`}
      className={buttonVariants({
        variant: "default",
      })}
    >
      <Wallet className='ml-2' />
      شارژ کیف پول
    </Link>
  );
}
