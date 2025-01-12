import CotopiaButton from '@/components/shared-ui/c-button';
import CotopiaInput from '@/components/shared-ui/c-input';
import CotopiaPasswordInput from '@/components/shared-ui/c-password-input';
import { buttonVariants } from '@/components/ui/button';
import { routeResolver } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { useAppDispatch, useAppSelector } from '@/store';
import { registerThunk } from '@/store/slices/auth/slice';
import { AuthenticateType } from '@/types/authenticate';
import { thunkResHandler } from '@/utils/utils';
import { useFormik } from 'formik';
import { MoveRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import CotopiaCheckbox from '@/components/shared-ui/c-checkbox';

//Login form wrapper
type Props = {
  onLoggedIn?: (res: AuthenticateType) => void;
};
export default function SignUpForm({ onLoggedIn }: Props) {
  const { isLoading } = useAppSelector((store) => store.auth);
  const dispatch = useAppDispatch();

  const { values, touched, errors, getFieldProps, handleSubmit } = useFormik({
    initialValues: {
      username: '',
      password: '',
      email: '',
    },
    validationSchema: Yup.object().shape({
      username: Yup.string()
        .matches(
          /^[a-zA-Z0-9_]+$/,
          'Username can only contain letters, numbers, and underscores.',
        )
        .min(5, 'Username must be at least 5 characters long.')
        .max(20, 'Username cannot be longer than 20 characters.')
        .required('Username is required'),
      email: Yup.string().email('Email is wrong').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values, actions) => {
      dispatch(
        registerThunk({
          username: values.username,
          password: values.password,
          email: values.email,
        }),
      );
    },
  });

  return (
    <div className="flex flex-col gap-y-8 items-start px-6 md:px-0">
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
        <div className="flex flex-col gap-y-2">
          <strong className="text-xl">Register to Cotopia</strong>
          <p className="text-black/60">
            By entering username & password & email, you can register to cotopia
            lite.
          </p>
        </div>
        <CotopiaInput
          {...getFieldProps('username')}
          placeholder="Enter the username"
          label="Username"
          hasError={!!touched.username && !!errors.username}
          helperText={
            !!touched.username && !!errors.username && errors.username
          }
        />

        <CotopiaInput
          {...getFieldProps('email')}
          placeholder="Enter the email"
          label="Email"
          hasError={!!touched.email && !!errors.email}
          helperText={!!touched.email && !!errors.email && errors.email}
        />

        <CotopiaPasswordInput
          {...getFieldProps('password')}
          placeholder="Enter the password"
          label="Password"
          hasError={!!touched.password && !!errors.password}
          helperText={
            !!touched.password && !!errors.password && errors.password
          }
        />

        <small>By registering to lite, you accept terms and conditions</small>
        <CotopiaButton
          type="submit"
          disabled={!values.username || !values.password || !values.email}
          loading={isLoading}
        >
          Register
        </CotopiaButton>
      </form>
      <hr className="w-full" />
      <div className="flex flex-col gap-y-4 items-start">
        <Link
          to={routeResolver(paths.auth.index, paths.auth.login)}
          className={buttonVariants({
            variant: 'link',
            className: '!px-0 !py-0 h-auto',
          })}
        >
          Have an account? Login
          <MoveRight className="ml-2" size={12} />
        </Link>
      </div>
    </div>
  );
}
