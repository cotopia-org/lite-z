import { buttonVariants } from "@/components/ui/button";
import { paths } from "@/routes/paths";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function AddCreditButton() {
  return (
    <Link
      to={paths.profile.credits.add}
      className={buttonVariants({
        variant: "default",
      })}
    >
      <Plus className='ml-2' />
      ایحاد کد اعتبار
    </Link>
  );
}
