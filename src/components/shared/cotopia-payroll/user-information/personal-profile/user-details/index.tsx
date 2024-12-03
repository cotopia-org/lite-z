import CotopiaButton from "@/components/shared-ui/c-button";
import CotopiaInput from "@/components/shared-ui/c-input";
import useAuth from "@/hooks/auth";
import useUserContract from "@/hooks/contract";
import axiosInstance from "@/services/axios";
import { useFormik } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";

export default function PayrollUserDetails() {
    const { user } = useAuth();
    const { userContract } = useUserContract();

    const { isSubmitting, touched, errors, getFieldProps, handleSubmit } =
        useFormik({
            enableReinitialize: true,
            initialValues: {
                name: user?.name ?? "",
                email: user?.email ?? "",
                paymentAddress : userContract?.payment_address ?? "",
            },
            validationSchema: Yup.object().shape({
                name: Yup.string().required("Name is required"),
                email: Yup.string().required("Email is required"),
                paymentAddress: Yup.string().required("Payment Address is required"),
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
            className='w-full flex flex-col gap-y-7 items-center justify-center'
        >
            <CotopiaInput
                {...getFieldProps("name")}
                placeholder='Enter the name'
                label='Your name'
                hasError={!!touched.name && !!errors.name}
                helperText={!!touched.name && !!errors.name && errors.name}
            />


            <CotopiaInput
                {...getFieldProps("email")}
                placeholder='Enter the email'
                label='Your email'
                hasError={!!touched.email && !!errors.email}
                helperText={!!touched.email && !!errors.email && errors.email}
            />

            <CotopiaInput
                {...getFieldProps("paymentAddress")}
                placeholder='Enter the payment address'
                label='Your payment address'
                hasError={!!touched.paymentAddress && !!errors.paymentAddress}
                helperText={!!touched.paymentAddress && !!errors.paymentAddress && errors.paymentAddress}
            />

            <CotopiaInput
                {...getFieldProps("user-name")}
                label='Your username'
                value={user?.username}
                disabled
            />

            <CotopiaInput
                {...getFieldProps("id")}
                label='Your id'
                value={user?.id}
                disabled
            />

            <CotopiaButton
                loading={isSubmitting}
                type='submit'
                className='w-full'
            >
                Save
            </CotopiaButton>
        </form>
    )
}