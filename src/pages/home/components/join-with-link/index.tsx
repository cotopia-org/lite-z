import CotopiaButton from "@/components/shared-ui/c-button";
import CotopiaInput from "@/components/shared-ui/c-input";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

export default function JoinWorkspaceWithLink() {
  const navigate = useNavigate();

  const { values, touched, errors, getFieldProps, handleSubmit } = useFormik({
    initialValues: {
      link: "",
    },
    validationSchema: Yup.object().shape({
      link: Yup.string().required("Link is required"),
    }),
    onSubmit: async (values, actions) => {
      navigate(values.link);
    },
  });
  const submitDisabled = !values.link;

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col gap-y-2 md:flex-row items-start gap-x-4 w-full'
    >
      <CotopiaInput
        {...getFieldProps("link")}
        hasError={!!touched.link && !!errors.link}
        helperText={!!touched.link && !!errors.link && errors.link}
        placeholder='Enter link'
        className='flex-1 py-4 px-4 2xs:w-auto xs:w-full'
      />
      <CotopiaButton
        className='h-3.25 md:w-10.5 w-full'
        disabled={submitDisabled}
        variant={submitDisabled ? "outline" : "default"}
        size={"sm"}
      >
        Join with link
      </CotopiaButton>
    </form>
  );
}
