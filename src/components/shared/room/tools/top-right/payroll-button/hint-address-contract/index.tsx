import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import InsertButton from "./insert-button";
import useAuth from "@/hooks/auth";

export default function HintAddressContract() {
  const { user } = useAuth();

  if (!user?.active_contract) return null;

  if (user?.active_contract?.payment_address) return null;

  return (
    <Alert variant='destructive'>
      <AlertCircle className='h-4 w-4' />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription className='mb-2'>
        You didn't set a payment address for this contract!
      </AlertDescription>
      <InsertButton contract={user?.active_contract} />
    </Alert>
  );
}
