import CotopiaSwitch from '@/components/shared-ui/c-switch';
import React from 'react';
import { useContractFormik } from '.';

export default function Extensions() {
  const { formik } = useContractFormik();

  const values = formik?.values;

  return (
    <div>
      <CotopiaSwitch
        label="Auto Renewal"
        checked={values?.auto_renewal === 1}
        onCheckedChange={(value) => {
          formik?.setFieldValue('auto_renewal', value === true ? 1 : 0);
        }}
        className="flex-col-reverse gap-y-4 [&_label]:font-bold [&_label]:text-base items-start"
      />
    </div>
  );
}
