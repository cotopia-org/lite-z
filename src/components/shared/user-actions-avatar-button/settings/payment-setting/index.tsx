import CotopiaButton from "@/components/shared-ui/c-button";
import CotopiaInput from "@/components/shared-ui/c-input";
import MonthCountdown from "@/components/shared/cotopia-payroll/counter";
import useUserContract from "@/hooks/contract";
import {useState} from "react";

export default function PaymentsSettings() {
    const { userContract } = useUserContract();
    const payment_address = userContract?.payment_address
    const [paymentAddress, setPaymentAddress] = useState<string>(payment_address ? payment_address : "");
    const [editAddress, setEditAddress] = useState<boolean>(false)

    function handleChangePaymentAddress(value: string) {
        if (editAddress) {
            setPaymentAddress(value);
        }
    }

    return (
        <>
            <MonthCountdown/>
            <hr />

            <div className="w-full my-4 flex flex-col items-center justify-center px-2">
                <CotopiaInput value={paymentAddress ? paymentAddress : payment_address} onChange={e => handleChangePaymentAddress(e.target.value)} label="Payment Address" placeholder="Enter you're payment address" />
                <CotopiaButton className="bg-primary text-white px-5 w-full mt-3" onClick={() => setEditAddress(prevState => !prevState)}>{editAddress ? "Save" : "Edit"}</CotopiaButton>
            </div>
        </>
    )
}