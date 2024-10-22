import ModalContentWrapper from "@/components/partials/modal/content-wrapper";
import { useAddPersonnel } from "..";
import { useFormik } from "formik";
import { Gender, PersonnelStatus } from "@/types/person";
import { useLoading } from "@/hooks";
import axiosInstance from "@/services/axios";
import { toast } from "sonner";
import { OrgButton, OrgInput } from "@/components/shared-ui";
import * as Yup from "yup";
import OrgRadio from "@/components/shared-ui/o-radio";
import { persianToEnglishNumbers } from "@/lib/utils";

export default function AddPersonnelSingle() {
  const { startLoading, stopLoading, isLoading } = useLoading();

  const { onClose, onAdd } = useAddPersonnel();

  const {
    values,
    errors,
    touched,
    getFieldProps,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullname: "",
      mobile: "",
      national_code: "",
      gender: Gender.Male,
      status: PersonnelStatus.Active,
    },
    validationSchema: Yup.object().shape({
      fullname: Yup.string().required("نام الزامی می‌باشد"),
      mobile: Yup.string().required("شماره موبایل الزامی می‌باشد"),
      national_code: Yup.string().required("کد ملی الزامی می‌باشد"),
    }),
    onSubmit: (values) => {
      const { national_code, ...rest } = values;

      startLoading();
      axiosInstance
        .post(`/person`, {
          national_code: persianToEnglishNumbers(national_code),
          ...rest,
        })
        .then((res) => {
          stopLoading();
          toast.success("شخص اضافه گردید");
          //Close the modal
          onClose();
          //Trigger onAdd
          if (onAdd) onAdd(res.data);
        })
        .catch((err) => {
          stopLoading();
        });
    },
  });

  return (
    <ModalContentWrapper title='افزودن پرسنل فردی' onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-y-16 items-center mx-auto text-center'
      >
        <div className='flex flex-col gap-y-8 w-full'>
          <OrgInput
            {...getFieldProps("fullname")}
            error={!!touched.fullname && !!errors.fullname}
            helperText={(!!touched.fullname && errors.fullname) || ""}
            label='نام و نام خانوادگی پرسنل'
            variant='filled'
          />
          <OrgInput
            {...getFieldProps("mobile")}
            error={!!touched.mobile && !!errors.mobile}
            helperText={(!!touched.mobile && errors.mobile) || ""}
            label='شماره موبایل'
            variant='filled'
          />
          <OrgInput
            {...getFieldProps("national_code")}
            error={!!touched.national_code && !!errors.national_code}
            helperText={(!!touched.national_code && errors.national_code) || ""}
            label='کد ملی'
            variant='filled'
          />
          <OrgRadio
            items={[
              { label: "زن", value: Gender.FeMale },
              { label: "مرد", value: Gender.Male },
            ]}
            value={"" + values.gender}
            onValueChange={(value) => setFieldValue("gender", +value)}
            className='flex flex-row justify-center gap-x-12 w-full'
            label='جنسیت پرسنل'
          />
        </div>
        <div className='w-full flex flex-row items-center justify-between'>
          <OrgButton
            variant={"outline"}
            type='button'
            onClick={onClose}
            className='w-auto min-w-[80px]'
          >
            انصراف
          </OrgButton>
          <OrgButton
            className='w-auto min-w-[80px]'
            loading={isLoading}
            type='submit'
          >
            ثبت
          </OrgButton>
        </div>
      </form>
    </ModalContentWrapper>
  );
}
