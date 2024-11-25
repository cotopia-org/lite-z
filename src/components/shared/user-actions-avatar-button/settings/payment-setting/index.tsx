import CotopiaButton from "@/components/shared-ui/c-button";
import CotopiaInput from "@/components/shared-ui/c-input";
import ExpectedPayments from "@/components/shared/room/tools/top-left/payroll-button/expected-payments";
import PreviousPayments from "@/components/shared/room/tools/top-left/payroll-button/previous-payments";
import useUserContract from "@/hooks/contract";
import React, { useRef, useState } from "react";

export default function PaymentsSettings() {
    const { userContract } = useUserContract();
    const payment_address = userContract?.payment_address
    const [paymentAddress, setPaymentAddress] = useState<string>(payment_address ? payment_address : "");
    const [editAddress, setEditAddress] = useState<boolean>(false)

    function handleChangePaymentAddress(value: string) {
        if (value.length === payment_address?.length) {
            setEditAddress(true);
            setPaymentAddress(value);
        }

        setEditAddress(false)
    }

    return (
        <>
            <ExpectedPayments />
            <PreviousPayments />
            <div className="w-full flex items-center justify-center">
                <CotopiaInput value={paymentAddress ? paymentAddress : "User no have any contract yet"} onChange={e => handleChangePaymentAddress(e.target.value)} label="Payment Address" />
                <CotopiaButton className="bg-primary text-white">{editAddress ? "Save" : "Edit"}</CotopiaButton>
            </div>
        </>
    )
}