"use client";

import CotopiaButton from "@/components/shared-ui/c-button";
import CotopiaInput from "@/components/shared-ui/c-input";
import CotopiaPasswordInput from "@/components/shared-ui/c-password-input";
import { buttonVariants } from "@/components/ui/button";
import { routeResolver } from "@/lib/utils";
import { paths } from "@/routes/paths";
import { useAppDispatch, useAppSelector } from "@/store";
import { loginThunk } from "@/store/slices/auth/slice";
import { AuthenticateType } from "@/types/authenticate";
import { thunkResHandler } from "@/utils/utils";
import { useFormik } from "formik";
import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import * as Yup from "yup";

//Login form wrapper
type Props = {
  onLoggedIn?: (res: AuthenticateType) => void;
};
export default function SignInForm({ onLoggedIn }: Props) {
  const { isLoading } = useAppSelector((store) => store.auth);
  const dispatch = useAppDispatch();

  const { values, touched, errors, getFieldProps, handleSubmit } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values, actions) => {
      thunkResHandler(
        dispatch(
          loginThunk({ username: values.username, password: values.password })
        ),
        "auth/login/password",
        (res) => {
          console.log("res", res);
        },
        () => {}
      );
    },
  });

  return (
    <div className='flex flex-col gap-y-8 items-start px-6 md:px-0'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-y-6'>
        <div className='flex flex-col gap-y-2'>
          <strong className='text-xl'>Login to your account</strong>
          <p className='text-black/60'>
            By entering username & password of your account, you can login to
            your account.
          </p>
        </div>
        <CotopiaInput
          {...getFieldProps("username")}
          placeholder='Enter the username'
          label='Username'
          hasError={!!touched.username && !!errors.username}
          helperText={
            !!touched.username && !!errors.username && errors.username
          }
        />
        <CotopiaPasswordInput
          {...getFieldProps("password")}
          placeholder='Enter the password'
          label='Password'
          hasError={!!touched.password && !!errors.password}
          helperText={
            !!touched.password && !!errors.password && errors.password
          }
        />
        <CotopiaButton
          type='submit'
          disabled={!values.username || !values.password}
          loading={isLoading}
        >
          Login
        </CotopiaButton>
      </form>
      <hr className='w-full' />
      <div className='flex flex-col gap-y-4 items-start'>
        <Link
          to={routeResolver(paths.auth.index, paths.auth.register)}
          className={buttonVariants({
            variant: "link",
            className: "!px-0 !py-0 h-auto",
          })}
        >
          Register
          <MoveRight className='ml-2' size={12} />
        </Link>
        <Link
          to={routeResolver(paths.auth.index, paths.auth["forget-password"])}
          className={buttonVariants({
            variant: "link",
            className: "!px-0 !py-0 h-auto",
          })}
        >
          I don't remember my password
          <MoveRight className='ml-2' size={12} />
        </Link>
      </div>
    </div>
  );
}
