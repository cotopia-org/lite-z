import { MobileIcon } from "@/components/icons";
import { LabeledIcon } from "@/components/shared";
import { OrgInput } from "@/components/shared-ui";
import AuthButton from "../components/auth-button";
import { useFormik } from "formik";
import LinkOtpButton from "../components/link-otp-button";
import * as Yup from "yup";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { persianToEnglishNumbers, urlWithQueryParams } from "@/lib/utils";
import useQuery from "@/hooks/query-params";

interface Props {
  changeKey: (key: string, value: any) => void;
  nextStep: () => void;
  defaultMobile?: string;
}

const EnterMobileNumber = ({ changeKey, nextStep, defaultMobile }: Props) => {
  const navigator = useNavigate();

  const { query } = useQuery();

  const { errors, touched, values, getFieldProps, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: { mobile: defaultMobile ?? "" },
    validationSchema: Yup.object().shape({
      mobile: Yup.string()
        .min(11, "لطفا یک شماره ۱۱ رقمی وارد نمایید")
        .required("وارد کردن شماره موبایل الزامی می باشد"),
    }),
    onSubmit: (values) => {
      const mobile = persianToEnglishNumbers(values.mobile);
      changeKey("mobile", mobile);
      nextStep();
    },
  });

  const isOtpDisabled = !values.mobile || !!errors.mobile;

  const navToOtpHandler = useCallback(
    (token: string) => {
      console.log("token", token);
      navigator(
        urlWithQueryParams("/login/otp", {
          ...query,
          mobile: values.mobile,
          token,
        })
      );
    },
    [navigator, query, values.mobile]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className='flex w-full items-center flex-col gap-y-4'
    >
      <div className='flex flex-col items-start w-full gap-y-4'>
        <LabeledIcon lable='شماره موبایل' icon={<MobileIcon size={26} />} />
        <OrgInput
          {...getFieldProps("mobile")}
          error={!!touched.mobile && !!errors.mobile}
          helperText={(!!touched.mobile && errors.mobile) || ""}
          variant='filled'
          placeholder='وارد کردن شماره موبایل'
        />
        <AuthButton type='submit'>ادامه</AuthButton>
      </div>
      <LinkOtpButton
        onGetToken={navToOtpHandler}
        mobile={values.mobile}
        disabled={isOtpDisabled}
      />
    </form>
  );
};

export default EnterMobileNumber;
