import { OrgInput } from "@/components/shared-ui";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthButton from "../components/auth-button";
import ResendCodeHandler from "./resend-code";
import { useAppDispatch } from "@/store";
import { loginOtpThunk } from "@/store/slices/auth/slice";
import { persianToEnglishNumbers } from "@/lib/utils";
import { thunkResHandler } from "@/utils/utils";
import { toast } from "sonner";
interface Props {
  tempToken: string;
}

const SubmitOtpHandler = ({ tempToken }: Props) => {
  const dispatch = useAppDispatch();

  const { values, handleSubmit, errors, touched, getFieldProps } = useFormik({
    enableReinitialize: true,
    initialValues: {
      token: tempToken || "",
      code: "",
    },
    validationSchema: Yup.object().shape({
      code: Yup.string().required("وارد کردن کد تایید الزامی می باشد"),
    }),
    onSubmit: (values, action) => {
      values.code = persianToEnglishNumbers("" + values.code);
      thunkResHandler(
        dispatch(loginOtpThunk({ code: values.code, token: values.token })),
        "auth/login/mobile",
        (res) => {
          toast.success("با موفقیت وارد شدید");
        },
        (err) => {}
      );
    },
  });

  const isDisabled = !values.token || !values.code;

  return (
    <form onSubmit={handleSubmit} className='flex flex-col w-full gap-y-4'>
      <span className='text-base text-black/[0.87]'>کد تایید</span>
      <OrgInput
        type='text'
        variant='filled'
        {...getFieldProps("code")}
        placeholder='1234'
        error={!!touched.code && !!errors.code}
        helperText={(!!touched.code && errors.code) || ""}
      />
      <AuthButton disabled={isDisabled} type='submit'>
        ورود
      </AuthButton>
      <ResendCodeHandler />
    </form>
  );
};

export default SubmitOtpHandler;
