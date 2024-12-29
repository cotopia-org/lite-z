import CotopiaInput from '@/components/shared-ui/c-input';
import React from 'react';
import { useContractFormik } from '.';

export default function PaymentDetails() {
  const { formik } = useContractFormik();

  const touched = formik?.touched;
  const errors = formik?.errors;

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-4">
        <CotopiaInput
          {...formik?.getFieldProps('amount')}
          placeholder="Enter the amount"
          label="Contract amount"
          type="number"
          hasError={!!touched?.amount && !!errors?.amount}
          helperText={
            touched?.amount && typeof errors?.amount === 'number'
              ? errors?.amount
              : ''
          }
        />
      </div>
      <div className="col-span-12 md:col-span-4">
        <CotopiaInput
          {...formik?.getFieldProps('currency')}
          placeholder="Enter the currency"
          label="Contract currency"
          type="text"
          hasError={!!touched?.currency && !!errors?.currency}
          helperText={
            touched?.currency && typeof errors?.currency === 'string'
              ? errors.currency
              : ''
          }
        />
      </div>
      <div className="col-span-12">
        <CotopiaInput
          {...formik?.getFieldProps('payment_address')}
          placeholder="Enter payment address"
          label="Payment Address"
          type="text"
          hasError={!!touched?.payment_address && !!errors?.payment_address}
          helperText={
            touched?.payment_address &&
            typeof errors?.payment_address === 'string'
              ? errors?.payment_address
              : ''
          }
        />
      </div>
    </div>
  );
}
