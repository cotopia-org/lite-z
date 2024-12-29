import { useContractFormik } from '.';
import CotopiaInput from '@/components/shared-ui/c-input';

export default function MinHours() {
  const { formik } = useContractFormik();

  const touched = formik?.touched;
  const errors = formik?.errors;

  return (
    <div>
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
  );
}
