import { useContractFormik } from '.';
import CotopiaInput from '@/components/shared-ui/c-input';

export default function MaxHours() {
  const { formik } = useContractFormik();

  const touched = formik?.touched;
  const errors = formik?.errors;

  return (
    <div>
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
  );
}
