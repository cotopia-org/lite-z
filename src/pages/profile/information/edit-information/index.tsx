import { OrgButton, OrgInput } from "@/components/shared-ui";
import useAuth from "@/hooks/auth";
import { useAppDispatch } from "@/store";
import { updateProfileThunk } from "@/store/slices/auth/slice";
import { thunkResHandler } from "@/utils/utils";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function EditInformation() {
  const dispatch = useAppDispatch();

  const { isLoading, user } = useAuth();

  const { errors, touched, values, getFieldProps, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user?.name ?? "",
      admin_name: user?.admin_name ?? "",
      phone: user?.phone ?? "",
      address: user?.address ?? "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("نام سازمان نمی‌تواند خالی باشد"),
      admin_name: Yup.string().required("نام مدیر نمی‌تواند خالی باشد"),
    }),
    onSubmit: (values, actions) => {
      //   thunkResHandler(
      //     dispatch(updateProfileThunk(values)),
      //     "auth/update-profile",
      //     () => {},
      //     () => {}
      //   );
    },
  });

  return (
    <>
      <form
        className='flex flex-col items-start gap-y-12'
        onSubmit={handleSubmit}
      >
        <div className='flex flex-col gap-y-8 w-full'>
          <OrgInput
            {...getFieldProps("name")}
            error={!!touched.name && !!errors.name}
            helperText={(!!touched.name && errors.name) || ""}
            label='نام سازمان'
            variant='text-dasshed'
            dir='rtl'
            disabled
          />
          <OrgInput
            {...getFieldProps("admin_name")}
            error={!!touched.admin_name && !!errors.admin_name}
            helperText={(!!touched.admin_name && errors.admin_name) || ""}
            label='نام ادمین سازمان'
            variant='text-dasshed'
            dir='rtl'
            disabled
          />
          <OrgInput
            {...getFieldProps("phone")}
            error={!!touched.phone && !!errors.phone}
            helperText={(!!touched.phone && errors.phone) || ""}
            label='شماره موبایل ادمین سازمان'
            variant='text-dasshed'
            dir='rtl'
            disabled
          />
          <OrgInput
            {...getFieldProps("address")}
            error={!!touched.address && !!errors.address}
            helperText={(!!touched.address && errors.address) || ""}
            label='آدرس'
            variant='text-dasshed'
            dir='rtl'
            disabled
          />
          <OrgInput
            label='تعداد پرسنل سازمان'
            variant='text-dasshed'
            dir='rtl'
            disabled
          />
        </div>
      </form>
    </>
  );
}
