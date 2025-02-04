import CotopiaSwitch from '@/components/shared-ui/c-switch';
import React from 'react';
import { useContractFormik } from '.';

export default function InJob() {
  const { formik } = useContractFormik();

  const values = formik?.values;

  return (
    <div>
      <CotopiaSwitch
        label="User must has jobs to count time"
        checked={values?.in_job === 1}
        onCheckedChange={(value) => {
          formik?.setFieldValue('in_job', value === true ? 1 : 0);
        }}
        className="flex-col-reverse gap-y-4 [&_label]:font-bold [&_label]:text-base items-start"
      />
    </div>
  );
}
