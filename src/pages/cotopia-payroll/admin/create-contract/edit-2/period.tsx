import CotopiaInput from '@/components/shared-ui/c-input';
import React from 'react';
import { useContractFormik } from '.';

export default function Period() {
  const { formik } = useContractFormik();

  const touched = formik?.touched;
  const errors = formik?.errors;

  return (
    <div className="gap-4 flex-wrap grid grid-cols-12">
      <div className="col-span-12 md:col-span-4">
        <CotopiaInput
          {...formik?.getFieldProps('start_at')}
          placeholder="Enter the start date (YYYY-MM-DD)"
          label="Starts at"
          type="date"
          hasError={!!touched?.start_at && !!errors?.start_at}
          helperText={
            touched?.start_at && typeof errors?.start_at === 'string'
              ? errors?.start_at
              : ''
          }
        />
      </div>
      <div className="col-span-12 md:col-span-4">
        <CotopiaInput
          {...formik?.getFieldProps('end_at')}
          placeholder="Enter the expiration date (YYYY-MM-DD)"
          label="Ends at"
          type="date"
          hasError={!!touched?.end_at && !!errors?.end_at}
          helperText={
            touched?.end_at && typeof errors?.end_at === 'string'
              ? errors?.end_at
              : ''
          }
        />
      </div>
    </div>
  );
}
