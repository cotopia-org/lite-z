import { LabeledIcon, PasswordInput } from "@/components/shared";
import AuthButton from "../components/auth-button";
import { LockIcon } from "@/components/icons";
import LinkOtpButton from "../components/link-otp-button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "@/store";
import { loginThunk } from "@/store/slices/auth/slice";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { persianToEnglishNumbers, urlWithQueryParams } from "@/lib/utils";
import useQuery from "@/hooks/query-params";
import { thunkResHandler } from "@/utils/utils";
import { toast } from "sonner";
import { OrgButton } from "@/components/shared-ui";
import { Edit } from "lucide-react";

interface Props {
  mobile: string;
  onEditPhone: () => void;
}

const EnterPassword = ({ mobile, onEditPhone }: Props) => {
  const dispatch = useAppDispatch();

  const authSlice = useAppSelector((store) => store.auth);
  const loading = authSlice?.isLoading ?? false;

  const { query } = useQuery();

  const navigator = useNavigate();
  const { errors, values, touched, getFieldProps, handleSubmit } = useFormik({
    initialValues: { mobile: mobile ? mobile : "", password: "" },
    validationSchema: Yup.object().shape({
      password: Yup.string().required("وارد کردن رمز عبور الزامی می باشد"),
    }),
    onSubmit: async (values) => {
      const finalmobile = persianToEnglishNumbers(values.mobile);

      thunkResHandler(
        dispatch(
          loginThunk({ mobile: finalmobile, password: values.password })
        ),
        "auth/login/password",
        (res) => {
          toast.success("با موفقیت وارد شدید");
        },
        (err) => {}
      );
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
        <div className='flex flex-col items-start'>
          <OrgButton
            onClick={onEditPhone}
            variant={"outline"}
            startIcon={<Edit />}
            type='button'
          >
            {mobile}
          </OrgButton>
        </div>
        <LabeledIcon lable='رمز عبور' icon={<LockIcon size={24} />} />
        <PasswordInput
          {...getFieldProps("password")}
          error={!!touched.password && !!errors.password}
          helperText={(!!touched.password && errors.password) || ""}
          variant='filled'
          placeholder='رمز عبور'
        />
        <AuthButton loading={loading} type='submit'>
          ادامه
        </AuthButton>
      </div>
      <div className='flex items-center justify-between w-full'>
        <LinkOtpButton
          onGetToken={navToOtpHandler}
          mobile={values.mobile}
          disabled={isOtpDisabled}
        />
        <LinkOtpButton
          onGetToken={navToOtpHandler}
          mobile={values.mobile}
          disabled={isOtpDisabled}
          text='فراموشی رمز عبور'
        />
      </div>
    </form>
  );
};

export default EnterPassword;
