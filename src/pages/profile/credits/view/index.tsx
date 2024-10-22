import NormalPageHolder from "@/components/containers/normal-page-holder";
import { OrgInput } from "@/components/shared-ui";
import OrgDateInput from "@/components/shared-ui/o-date-input";
import { useApi } from "@/hooks/use-api";
import { FetchDataType } from "@/services/axios";
import { CreditType } from "@/types/credit";
import { useParams } from "react-router-dom";

export default function ViewCreditPage() {
  const { id } = useParams();

  //   const { data, isLoading } = useApi<FetchDataType<CreditType>>(
  //     `/credit-codes/${id}`
  //   );

  return (
    <NormalPageHolder hasBack title='جزئیات'>
      <div className='grid grid-cols-12 gap-4 mb-6'>
        <div className='col-span-12 md:col-span-6'>
          <OrgInput variant='filled' label='نام کد اعتبار' />
        </div>
        <div className='col-span-12 md:col-span-6'>
          <OrgInput variant='filled' label='کد اعتبار' />
        </div>
        <div className='col-span-12 md:col-span-6'>
          <OrgInput variant='filled' type='number' label='مبلغ (تومان)' />
        </div>
        <div className='col-span-12 md:col-span-6'>
          <OrgDateInput
            // defaultDate={
            //   values.date_end
            //     ? moment(values.date_end, "jYYYY-jMM-jDD")
            //     : moment()
            // }
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
            variant='filled'
            type='number'
            label='محدودیت تعداد استفاده'
          />
        </div>
        <div className='col-span-12 md:col-span-6'>
          <OrgInput
            variant='filled'
            type='number'
            label='محدودیت تعداد استفاده به ازای هر کاربر'
          />
        </div>
      </div>
    </NormalPageHolder>
  );
}
