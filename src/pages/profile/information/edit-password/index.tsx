import { LabeledIcon } from "@/components/shared";
import { OrgButton, OrgInput } from "@/components/shared-ui";
import { useLoading } from "@/hooks";
import axiosInstance from "@/services/axios";
import { useAppDispatch } from "@/store";
import { logout } from "@/store/slices/auth/slice";
import { useFormik } from "formik";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import * as Yup from "yup";

type Props = {
  onCancel?: () => void;
  onChanged?: () => void;
};

export default function EditPassword({ onCancel, onChanged }: Props) {
  const dispatch = useAppDispatch();

  const { startLoading, stopLoading, isLoading } = useLoading();

  const { errors, touched, values, getFieldProps, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: {
      password: "",
      confirmationPassword: "",
    },
    validationSchema: Yup.object().shape({
      password: Yup.string()
        .min(8, "حداقل یک رمز عبور ۸ رقمی وارد نمایید")
        .required("رمز عبور الزامی می‌باشد."),
      confirmationPassword: Yup.string()
        //@ts-ignore
        .oneOf([Yup.ref("password"), null], "رمز‌های عبور باهم تطابق ندارد!")
        .required("لطفا رمز عبور جدید را تکرار نمایید"),
    }),
    onSubmit: (values, actions) => {
      startLoading();
      axiosInstance
        .post(`/users`, { password: values.password })
        .then((res) => {
          stopLoading();
          toast.success("رمز عبور با موفقیت تغییر یافت.");
          actions.resetForm();
          if (onChanged) onChanged();
          dispatch(logout());
        })
        .catch((err) => {
          stopLoading();
        });
    },
  });

  return (
    <form
      onSubmit={handleSubmit}
      className='flex w-full items-center flex-col gap-y-4'
    >
      <div className='flex flex-col items-start w-full gap-y-4'>
        <LabeledIcon lable='رمز عبور' icon={<Lock size={26} />} />
        <OrgInput
          {...getFieldProps("password")}
          error={!!touched.password && !!errors.password}
          helperText={(!!touched.password && errors.password) || ""}
          variant='filled'
          placeholder='رمز عبور جدید'
        />
        <OrgInput
          {...getFieldProps("confirmationPassword")}
          error={
            !!touched.confirmationPassword && !!errors.confirmationPassword
          }
          helperText={
            (!!touched.confirmationPassword && errors.confirmationPassword) ||
            ""
          }
          variant='filled'
          placeholder='تکرار رمز عبور جدید'
        />
        <OrgButton
          loading={isLoading}
          disabled={!(!!values.password && !!values.confirmationPassword)}
          className='h-[64px] text-xl'
        >
          ثبت
        </OrgButton>
        {!!onCancel && (
          <OrgButton
            onClick={onCancel}
            variant={"outline"}
            className='h-[64px] text-xl'
          >
            انصراف
          </OrgButton>
        )}
      </div>
    </form>
  );
}
