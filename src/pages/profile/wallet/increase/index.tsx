import NormalPageHolder from "@/components/containers/normal-page-holder";
import CreditOverview from "../credit-overview";
import AmountSelector from "@/components/shared/amount-selector";
import { useCallback, useState } from "react";
import { OrgButton, OrgInput } from "@/components/shared-ui";
import GatewaySelector from "@/components/shared/gateways-selector";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axiosInstance from "@/services/axios";
import { GatewayType } from "@/types/gateway";
import { useLoading } from "@/hooks";
import { persianToEnglishNumbers } from "@/lib/utils";

export default function IncreasePage() {
  const [selectedAmount, setSelectedAmount] = useState<number>();
  const handleSelectAmount = useCallback((amount: number) => {
    setSelectedAmount(amount);
  }, []);

  const [selectedGateway, setSelectedGateway] = useState<GatewayType>();
  const handleSelectGateway = (gw: GatewayType) => setSelectedGateway(gw);

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  const { startLoading, stopLoading, isLoading } = useLoading();

  let finalAmount = selectedAmount;

  const handlePay = () => {
    if (finalAmount === undefined)
      return toast.error("لطفا مبلغی را جهت پرداخت انتخاب نمایید!");

    if (selectedGateway === undefined)
      return toast.error("لطفا درگاه مد نظر خود جهت پرداخت را انتخاب نمایید");

    startLoading();

    axiosInstance
      .post(`/users/credit`, {
        price: finalAmount,
        mode: "web",
        gateway: selectedGateway.id,
      })
      .then((res) => {
        stopLoading();

        const payment_links = res.data;

        if (!payment_links?.url) {
          return toast.error("لینک پرداخت یافت نشد.");
        }

        //Redirect user to gateway
        window.location.href = payment_links.url;
      })
      .catch((err) => {
        stopLoading();
      });
  };

  return (
    <NormalPageHolder hasBack title='کیف پول سازمان'>
      <div className='grid grid-cols-12 gap-4'>
        <div className='col-span-12 xl:col-span-9 order-2 xl:order-1'>
          <div className='flex flex-col gap-y-16 w-full'>
            <div className='flex flex-col gap-y-6'>
              <strong className='text-black/70 text-xl font-normal'>
                مبالغ پیشنهادی:
              </strong>
              <AmountSelector
                defaultAmount={selectedAmount}
                onSelect={handleSelectAmount}
                items={[1000000, 2000000, 3000000, 4000000, 5000000, 10000000]}
              />
            </div>
            <OrgInput
              label='مبلغ دلخواه'
              value={selectedAmount}
              onChange={(e) =>
                setSelectedAmount(+persianToEnglishNumbers(e.target.value))
              }
              variant='filled'
            />
            <div className='w-[400px] max-w-full'>
              <GatewaySelector onSelect={handleSelectGateway} />
            </div>
            <div className='flex flex-row items-center justify-end'>
              <div className='flex flex-row items-center gap-x-4'>
                <OrgButton onClick={handleBack} variant={"outline"}>
                  انصراف
                </OrgButton>
                <OrgButton
                  onClick={handlePay}
                  variant={"default"}
                  disabled={finalAmount === 0 || finalAmount === undefined}
                  loading={isLoading}
                >
                  پرداخت آنلاین
                </OrgButton>
              </div>
            </div>
          </div>
        </div>
        <div className='col-span-12 xl:col-span-3 order-1 xl:order-2'>
          <CreditOverview />
        </div>
      </div>
    </NormalPageHolder>
  );
}
