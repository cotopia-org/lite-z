import { OrgInput } from "@/components/shared-ui";
import { Gender, PersonType } from "@/types/person";
import { ReactNode } from "react";

type Props = {
  person: PersonType;
};

function InputHolder({ children }: { children: ReactNode }) {
  return <div className='w-full md:w-[400px] max-w-full'>{children}</div>;
}

export default function Details({ person }: Props) {
  return (
    <div className='grid grid-cols-12 gap-4'>
      <div className='col-span-12 md:col-span-6'>
        <InputHolder>
          <OrgInput
            label='نام و نام خانوادگی'
            value={person?.fullname ?? ""}
            disabled
            variant='filled'
          />
        </InputHolder>
      </div>
      <div className='col-span-12 md:col-span-6'>
        <InputHolder>
          <OrgInput
            label='جنسیت'
            value={person?.gender === Gender.Male ? "مرد" : "زن"}
            disabled
            variant='filled'
          />
        </InputHolder>
      </div>
      <div className='col-span-12 md:col-span-6'>
        <InputHolder>
          <OrgInput
            label='کد ملی'
            value={person?.national_code ?? ""}
            disabled
            variant='filled'
          />
        </InputHolder>
      </div>
      <div className='col-span-12 md:col-span-6'>
        <InputHolder>
          <OrgInput
            label='شماره موبایل'
            value={person?.mobile ?? ""}
            disabled
            variant='filled'
          />
        </InputHolder>
      </div>
    </div>
  );
}
