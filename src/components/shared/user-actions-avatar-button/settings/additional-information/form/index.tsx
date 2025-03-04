import CotopiaButton from "@/components/shared-ui/c-button";
import CotopiaInput from "@/components/shared-ui/c-input";
import useAuth from "@/hooks/auth";
import axiosInstance from "@/services/axios";
import { useFormik } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";

export default function UserDetailForm() {
  const { user } = useAuth();

  const { isSubmitting, touched, errors, getFieldProps, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      initialValues: {
        name: user?.name ?? "",
      },
      validationSchema: Yup.object().shape({
        name: Yup.string().required("Name is required"),
      }),
      onSubmit: (values, actions) => {
        actions.setSubmitting(true);
        axiosInstance
          .put(`/users/update`, {
            name: values.name,
          })
          .then((res) => {
            actions.setSubmitting(false);
            toast.success("Your information has been updated.");
          })
          .catch((err) => {
            actions.setSubmitting(false);
          });
      },
    });

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col gap-y-16 items-start'
    >
      <div className='flex flex-col gap-y-4'>
        <div className='flex flex-col gap-y-2'>
          <strong>You can change your user information here</strong>
          <p className='text-black/60 text-base'>
            Be careful, changing information here effects your presence
            everywhere.
          </p>
        </div>
        <CotopiaInput
          {...getFieldProps("name")}
          placeholder='Enter the name'
          label='Your name'
          hasError={!!touched.name && !!errors.name}
          helperText={!!touched.name && !!errors.name && errors.name}
        />
      </div>
      <CotopiaButton
        loading={isSubmitting}
        type='submit'
        className='w-[100px] max-w-full'
      >
        Save
      </CotopiaButton>
    </form>
  );
}
