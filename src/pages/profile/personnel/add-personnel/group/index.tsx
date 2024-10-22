import ModalContentWrapper from "@/components/partials/modal/content-wrapper";
import { useAddPersonnel } from "..";
import Uploader from "@/components/shared/uploader";
import OrgAlert from "@/components/shared-ui/o-alert";
import { CircleAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { OrgButton } from "@/components/shared-ui";
import { useFormik } from "formik";
import { toast } from "sonner";
import axiosInstance from "@/services/axios";
import { useLoading } from "@/hooks";
import { ChangeEvent, useCallback } from "react";

export default function AddPersonnelGroup() {
  const { startLoading, stopLoading, isLoading } = useLoading();

  const { onClose, onAdd } = useAddPersonnel();

  const { setFieldValue, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: { file: "" },
    onSubmit: (values) => {
      if (!values.file) {
        toast.error("لطفا فایل CSV را جهت بارگذاری انتخاب نمایید.");
        return;
      }

      const formData = new FormData();
      formData.append("file", values.file);

      startLoading();
      axiosInstance
        .post(`/person/csv`, formData)
        .then((res) => {
          stopLoading();
          toast.success("فایل با موفقیت بارگذاری شد.");
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

  const handleSelectFile = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setFieldValue("file", e.target.files[0]);
      }
    },
    [setFieldValue]
  );

  const handleResetFile = useCallback(() => {
    setFieldValue("file", undefined);
  }, [setFieldValue]);

  return (
    <ModalContentWrapper title='افزودن پرسنل گروهی' onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-y-8 items-center w-[295px] max-w-full mx-auto text-center'
      >
        <p className='text-label'>
          یک فایل با فرمت csv که شامل اطلاعات پرسنل سازمان است آپلود کنید.
        </p>
        <Uploader
          formats={["text/csv"]}
          title='آپلود فایل'
          onChange={handleSelectFile}
          backToNormalState={handleResetFile}
        />
        <div className='flex flex-col'>
          <OrgAlert
            icon={<CircleAlert />}
            title='برای دیدن نمونه فایل مورد نظر، لطفا روی لینک زیر کلیک کنید:'
            variant='info'
          />
          <a
            target='_blank'
            href={`/assets/csv/customer.csv`}
            className={buttonVariants({
              variant: "link",
              class: "!text-black/70",
            })}
          >
            Sample.csv
          </a>
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
