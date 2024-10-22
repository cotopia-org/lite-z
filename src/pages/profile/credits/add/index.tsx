import NormalPageHolder from "@/components/containers/normal-page-holder";
import ChargeWalletButton from "./charge-wallet-button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { OrgButton, OrgInput } from "@/components/shared-ui";
import { useLoading } from "@/hooks";
import OrgDateInput from "@/components/shared-ui/o-date-input";
import moment from "moment-jalaali";
import { PersonAutocompleteType, PersonType } from "@/types/person";
import SelectPersonnel from "./select-personnel";
import { useCallback, useState } from "react";
import axiosInstance from "@/services/axios";
import Chips from "@/components/shared/chips";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/auth";
import Amount from "@/components/shared/amount";
import OrgAlert from "@/components/shared-ui/o-alert";
import { CircleAlert, X } from "lucide-react";
import OCustomRawDialog from "@/components/shared-ui/o-dialog/custom-raw-dialog";
import { paths } from "@/routes/paths";

export default function ProfileCreditAddPage() {
  const [isCreditAlertModalOpen, setCreditAlertModalOpen] = useState(false);

  const { user } = useAuth();

  const credit = user?.credit;

  const navigate = useNavigate();

  const { startLoading, stopLoading, isLoading } = useLoading();

  const {
    errors,
    touched,
    values,
    setFieldValue,
    getFieldProps,
    handleSubmit,
  } = useFormik<{
    name: string;
    price?: number;
    coupon: string;
    date_end?: string;
    maximum_use_count_per_user?: number;
    persons: PersonAutocompleteType[];
  }>({
    enableReinitialize: true,
    initialValues: {
      name: "",
      price: undefined,
      coupon: "",
      date_end: undefined,
      maximum_use_count_per_user: undefined,
      persons: [],
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("نام کد اعتبار الزامی می‌باشد"),
      price: Yup.number()
        .min(1, "مبلغ نباید کمتر از ۱ تومن باشد!")
        .required("قیمت الزامی می‌باشد"),
      maximum_use_count_per_user: Yup.number().required(
        "تعداد استفاده از کد به ازای هر کاربر الزامی می‌باشد."
      ),
    }),
    onSubmit: (values) => {
      if (!credit) {
        setCreditAlertModalOpen(true);
        return;
      }

      if (totalPrice > credit) {
        setCreditAlertModalOpen(true);
        return;
      }

      const { persons, ...rest } = values;

      const maximum_use_count_per_user = values.maximum_use_count_per_user ?? 0;

      startLoading();
      axiosInstance
        .post(`/credit-codes`, {
          ...rest,
          status: 1,
          maximum_use_count: persons.length * maximum_use_count_per_user,
          date_start: moment().format("jYYYY-jMM-jDD"),
          persons: persons.map((x) => x.id),
        })
        .then((res) => {
          stopLoading();
          navigate(`/profile/credits`);
        })
        .catch((err) => {
          stopLoading();
        });
    },
  });

  const handleSelectPersonnels = useCallback(
    (persons: PersonAutocompleteType[]) => {
      setFieldValue("persons", persons);
    },
    [setFieldValue]
  );

  const price = values.price ?? 0;
  const maximum_use_count_per_user = values.maximum_use_count_per_user ?? 0;

  const totalPrice = price * maximum_use_count_per_user * values.persons.length;

  return (
    <NormalPageHolder
      hasBack
      title='ایجاد کد اعتبار'
      actionNode={<ChargeWalletButton />}
    >
      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-12 gap-4 mb-6'>
          <div className='col-span-12 md:col-span-6'>
            <OrgInput
              {...getFieldProps("name")}
              error={!!touched.name && !!errors.name}
              helperText={(!!touched.name && errors.name) || ""}
              variant='filled'
              label='نام کد اعتبار'
            />
          </div>
          <div className='col-span-12 md:col-span-6'>
            <OrgInput
              {...getFieldProps("coupon")}
              error={!!touched.coupon && !!errors.coupon}
              helperText={(!!touched.coupon && errors.coupon) || ""}
              variant='filled'
              label='کد اعتبار'
            />
          </div>
          <div className='col-span-12 md:col-span-6'>
            <OrgInput
              {...getFieldProps("price")}
              error={!!touched.price && !!errors.price}
              helperText={(!!touched.price && errors.price) || ""}
              variant='filled'
              type='number'
              label='مبلغ (تومان)'
            />
          </div>
          <div className='col-span-12 md:col-span-6'>
            <OrgDateInput
              defaultDate={
                values.date_end
                  ? moment(values.date_end, "jYYYY-jMM-jDD")
                  : moment()
              }
              onSelectDate={(date) =>
                setFieldValue("date_end", date.format("jYYYY-jMM-jDD"))
              }
              error={!!touched.date_end && !!errors.date_end}
              helperText={(!!touched.date_end && errors.date_end) || ""}
              variant='filled'
              type='text'
              label='تاریخ انقضا'
              config={{
                system: "jalali",
              }}
            />
          </div>
          <div className='col-span-12 md:col-span-6'>
            <OrgInput
              {...getFieldProps("maximum_use_count_per_user")}
              error={
                !!touched.maximum_use_count_per_user &&
                !!errors.maximum_use_count_per_user
              }
              helperText={
                (!!touched.maximum_use_count_per_user &&
                  errors.maximum_use_count_per_user) ||
                ""
              }
              variant='filled'
              type='number'
              label='محدودیت تعداد استفاده به ازای هر کاربر'
            />
          </div>
          <div className='col-span-12 flex flex-col items-start gap-y-6'>
            <SelectPersonnel
              defaultItems={values.persons}
              onSave={handleSelectPersonnels}
            />
            <Chips
              items={values.persons.map((item) => ({
                label: item.fullname,
                value: item.id,
              }))}
              onRemove={(value) =>
                setFieldValue(
                  "persons",
                  values.persons.filter((x) => x.id !== value)
                )
              }
              limitShow={5}
            />
          </div>
        </div>
        <div className='flex flex-col'>
          <div className='flex flex-row gap-x-4 items-center'>
            <strong>مجموع مبلغ کد اعتبار:</strong>
            <Amount value={totalPrice} />
          </div>
          <OrgAlert
            icon={<CircleAlert />}
            title={`مجموعا ${
              values.persons.length * maximum_use_count_per_user
            } کد اعتبار ${price.toLocaleString()} تومانی`}
            variant='info'
          />
        </div>
        <div className='flex flex-row items-center justify-end'>
          <div className='flex flex-row items-center gap-x-4'>
            <OrgButton type='button' variant={"outline"}>
              انصراف
            </OrgButton>
            <OrgButton type='submit' loading={isLoading} variant={"default"}>
              ایجاد کد اعتبار
            </OrgButton>
          </div>
        </div>
      </form>
      <OCustomRawDialog
        open={isCreditAlertModalOpen}
        onOpenChange={(open) => setCreditAlertModalOpen(open)}
      >
        <div className='flex flex-col gap-y-12 items-center w-[340px] max-w-full mx-auto py-8'>
          <div className='flex flex-col rounded-full w-[96px] h-[96px] items-center justify-center bg-red-100 text-red-700'>
            <X size={40} />
          </div>
          <strong className='text-2xl font-medium'>
            متاسفانه موجودی شما کافی نیست
          </strong>
          <p className='text-label text-base font-normal text-center'>
            کاربر گرامی، برای ایجاد کد اعتبار بیشتر، لطفا ابتدا موجودی سازمانی
            خود را افزایش دهید.
          </p>
          <div className='flex flex-row items-center justify-between w-full'>
            <OrgButton
              onClick={() => setCreditAlertModalOpen(false)}
              variant={"outline"}
              className='w-auto px-6 h-[64px]'
            >
              انصراف
            </OrgButton>
            <OrgButton
              variant={"default"}
              className='w-auto px-6 h-[64px]'
              onClick={() =>
                navigate(
                  `${paths.profile.index}/${paths.profile.wallet.index}/${paths.profile.wallet.increase}`
                )
              }
            >
              شارژ موجودی
            </OrgButton>
          </div>
        </div>
      </OCustomRawDialog>
    </NormalPageHolder>
  );
}
