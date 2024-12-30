import CotopiaButton from '@/components/shared-ui/c-button';
import { useAppSelector } from '@/store';
import { useFormik } from 'formik';
import { useEffect, useCallback, useReducer, useState } from 'react';
import {
  initialValueContract,
  validationSchemaContract,
} from '@/utils/payroll-forms-settings';
import PayrollContractInputs from './components/contract-inputs';
import { fetchEmployeesData, fetchUserContract } from '@/utils/payroll';
import { PayrollInitialState, payrollReducer } from '../create-payments/state';
import useCreateContract from '@/hooks/use-create-contract';
import UserSelector from '@/components/shared/user-selector';
import { UserMinimalType } from '@/types/user';
import { UserContractType } from '@/types/contract';
import CotopiaIconButton from '@/components/shared-ui/c-icon-button';
import { X } from 'lucide-react';
import moment from 'moment';
import ManageContract from './edit-2';

type Props = {
  defaultContract?: UserContractType;
  onBack?: () => void;
  onUpdate?: (contract: UserContractType) => void;
};

export default function PayrollCreateContract({
  defaultContract,
  onBack,
  onUpdate,
}: Props) {
  if (defaultContract)
    return (
      <ManageContract
        onBack={onBack}
        onUpdate={onUpdate}
        defaultContract={defaultContract}
      />
    );

  return <ManageContract />;
}
