import { LinkButton, OrgImage } from "@/components/shared";
import useQuery from "@/hooks/query-params";
import { urlWithQueryParams } from "@/lib/utils";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
}

const OtpWrapper = ({ children }: Props) => {
  const { query } = useQuery();
  const mobile = query["mobile"] ?? undefined;
  return (
    <div className="flex h-full flex-col gap-y-5 w-full justify-center items-center">
      <span className="text-base text-black/[0.87] text-center">
        {`کد تایید به شماره ${mobile} ارسال شد، لطفا کد تایید دریافتی را در کادر زیر وارد کنید`}
      </span>
      <Link to={urlWithQueryParams("/login", { ...query, mobile })}>
        <LinkButton>ویرایش شماره موبایل</LinkButton>
      </Link>
      <OrgImage src="/assets/images/login-image.svg" height={100} />
      {children}
    </div>
  );
};

export default OtpWrapper;
