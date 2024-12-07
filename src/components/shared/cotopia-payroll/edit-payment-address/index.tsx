import CotopiaInput from "@/components/shared-ui/c-input";
import CotopiaButton from "@/components/shared-ui/c-button";
import useUserContract from "@/hooks/use-user-contract";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import useAuth from "@/hooks/auth";

export default function EditPaymentAddress() {
    const { userContract } = useUserContract();
    const { accessToken } = useAuth();
    const [paymentAddress, setPaymentAddress] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const [originalPaymentAddress, setOriginalPaymentAddress] = useState<string>("");

    useEffect(() => {
        if (userContract) {
            setPaymentAddress(userContract.payment_address || "");
            setOriginalPaymentAddress(userContract.payment_address || "");
        }
    }, [userContract]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentAddress(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await axios.put(
                `${process.env.REACT_APP_PUBLIC_API_URL}/contracts/${userContract?.id}`,
                {
                    payment_address: paymentAddress,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            toast.success("Payment address updated successfully!");
        } catch (error) {
            console.error("Error updating payment address:", error);
            toast.error("There was an error updating the payment address.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex items-center flex-col gap-y-3">
            <CotopiaInput
                placeholder="Please enter your wallet address"
                value={paymentAddress}
                onChange={handleChange}
                className="font-semibold"
            />

            <CotopiaButton
                onClick={handleSubmit}
                disabled={loading || paymentAddress === originalPaymentAddress || !paymentAddress}
                className="mt-4 w-full"
            >
                {loading ? "Updating..." : "Update Payment Address"}
            </CotopiaButton>
        </div>
    );
}
