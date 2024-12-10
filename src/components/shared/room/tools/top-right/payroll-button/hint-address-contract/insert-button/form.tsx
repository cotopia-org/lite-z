import CotopiaButton from "@/components/shared-ui/c-button";
import CotopiaInput from "@/components/shared-ui/c-input";
import axiosInstance from "@/services/axios";
import { useAppDispatch } from "@/store";
import { getProfileThunk } from "@/store/slices/auth/slice";
import { UserContractType } from "@/types/contract";
import { useFormik } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";

type Props = {
  contract: UserContractType;
  onSave: (contract: UserContractType) => void;
};

export default function InsertButtonForm({ contract, onSave }: Props) {
  const dispatch = useAppDispatch();

  const {
    isSubmitting,
    touched,
    errors,
    getFieldProps,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      payment_address: "",
    },
    validationSchema: Yup.object().shape({
      payment_address: Yup.string().required("Payment address is required"),
    }),
    onSubmit: (values, actions) => {
      actions.setSubmitting(true);
      axiosInstance
        .put(`/contracts/${contract.id}`, values)
        .then((res) => {
          actions.setSubmitting(false);
          toast.success(
            "Your payment address has been saved to your contract."
          );
          dispatch(getProfileThunk());
          if (onSave) onSave(res.data.data);
        })
        .catch((err) => {
          actions.setSubmitting(false);
        });
    },
  });

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col gap-y-16 items-start w-full'
    >
      <div className='flex flex-col gap-y-4 w-full'>
        <div className='flex flex-col gap-y-2'>
          <strong>Add payment address</strong>
        </div>
        <CotopiaInput
          {...getFieldProps("payment_address")}
          placeholder='Payment address'
          // label='Your report'
          hasError={!!touched.payment_address && !!errors.payment_address}
          helperText={
            !!touched.payment_address &&
            !!errors.payment_address &&
            errors.payment_address
          }
        />
      </div>
      <CotopiaButton
        loading={isSubmitting}
        type='submit'
        className='w-[100px] max-w-full'
      >
        Submit
      </CotopiaButton>
    </form>
  );
}
