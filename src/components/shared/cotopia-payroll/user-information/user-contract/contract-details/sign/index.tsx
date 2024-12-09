import { UserContractType } from "@/types/contract";
import AdminSignContract from "./admin-sign-contract";
import UserSignContract from "./contractor-sign-status";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Handshake } from "lucide-react";

type Props = {
  contract: UserContractType;
  onUpdate: (contract: UserContractType) => void;
};
export default function SignContract({ contract, onUpdate }: Props) {
  return (
    <div className='flex flex-col gap-y-2'>
      <AdminSignContract contract={contract} onUpdate={onUpdate} />
      <UserSignContract contract={contract} onUpdate={onUpdate} />
      {contract.contractor_sign_status === 1 &&
        contract.user_sign_status === 1 && (
          <Alert>
            <Handshake className='h-4 w-4' />
            <AlertTitle>{"Contract is approved"}</AlertTitle>
            <AlertDescription>
              {`You and admin both signed the contract.`}
            </AlertDescription>
          </Alert>
        )}
    </div>
  );
}
