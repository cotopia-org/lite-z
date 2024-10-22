import { LinkButton } from "@/components/shared";
import { useLoading } from "@/hooks";
import { persianToEnglishNumbers } from "@/lib/utils";
import axiosInstance from "@/services/axios";
import { Loader } from "lucide-react";
import { toast } from "sonner";

interface Props {
  disabled?: boolean;
  onGetToken: (token: string) => void;
  mobile: string;
  text?: string;
}

const LinkOtpButton = ({
  disabled,
  mobile,
  onGetToken,
  text = "ورود با رمز یک بار مصرف",
}: Props) => {
  const { startLoading, stopLoading, isLoading } = useLoading();
  //In login mode
  const getTokenByMobile = () => {
    const finalMobile = persianToEnglishNumbers(mobile);
    if (!finalMobile)
      return toast.error("لطفا ابتدا شماره موبایل را وارد نمایید.");
    startLoading();
    axiosInstance
      .post(`/auth/login/mobile`, {
        mobile: finalMobile,
      })
      .then((res) => {
        stopLoading();
        toast.success(
          "لطفا کد ارسال شده به ایمیل یا موبایل خود را وارد نمایید."
        );
        const backEndTempToken = res?.data?.token;
        if (backEndTempToken) onGetToken(backEndTempToken);
      })
      .catch((err) => {
        stopLoading();
      });
  };

  return isLoading ? (
    <Loader size={18} className='animate-spin' />
  ) : (
    <LinkButton
      onClick={getTokenByMobile}
      loading={isLoading}
      disabled={disabled}
    >
      {text}
    </LinkButton>
  );
};

export default LinkOtpButton;
