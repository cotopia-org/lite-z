import CotopiaSwitch from '@/components/shared-ui/c-switch';
import React from 'react';
import { useContractFormik } from '.';
import CotopiaInput from '@/components/shared-ui/c-input';

export default function MinMaxHours() {
  const { formik } = useContractFormik();

  const values = formik?.values;
  const touched = formik?.touched;
  const errors = formik?.errors;

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-4">
        <CotopiaSwitch
          label="Has min hours and max hours?"
          checked={values?.has_min_and_max}
          onCheckedChange={(value) => {
            formik?.setFieldValue('has_min_and_max', value === true);
          }}
          className="flex-col-reverse gap-y-4 [&_label]:font-bold [&_label]:text-base items-start"
        />
      </div>
      {values?.has_min_and_max === true && (
        <>
          <div className="col-span-12 md:col-span-4">
            <CotopiaInput
              {...formik?.getFieldProps('min_hours')}
              placeholder="Enter minimum hours"
              label="Min Hours"
              type="number"
              hasError={!!touched?.min_hours && !!errors?.min_hours}
              helperText={
                touched?.min_hours && typeof errors?.min_hours === 'string'
                  ? errors?.min_hours
                  : ''
              }
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <CotopiaInput
              {...formik?.getFieldProps('max_hours')}
              placeholder="Enter maximum hours"
              label="Max Hours"
              type="number"
              hasError={!!touched?.max_hours && !!errors?.max_hours}
              helperText={
                touched?.max_hours && typeof errors?.max_hours === 'string'
                  ? errors?.max_hours
                  : ''
              }
            />
          </div>
        </>
      )}
    </div>
  );
}
