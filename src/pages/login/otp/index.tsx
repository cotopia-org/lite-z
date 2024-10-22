import useQuery from "@/hooks/query-params";
import LoginWrapper from "../components/Wrapper";
import OtpWrapper from "./wrapper";
import SubmitOtpHandler from "./otp-handler";

interface Props {}

const LoginWithOtp = (props: Props) => {
  const { query } = useQuery();

  const token = query?.["token"] ?? "";

  return (
    <LoginWrapper>
      <OtpWrapper>
        <SubmitOtpHandler tempToken={token} />
      </OtpWrapper>
    </LoginWrapper>
  );
};

export default LoginWithOtp;
