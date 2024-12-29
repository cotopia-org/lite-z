import CotopiaButton from '@/components/shared-ui/c-button';
import BoxHolder from '@/components/shared/box-holder';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useLoading } from '@/hooks';
import { UserContractType } from '@/types/contract';
import { FormikProps, useFormik } from 'formik';
import { createContext, ReactNode, useContext } from 'react';

import * as Yup from 'yup';
import ContractParties from './parties';
import { initialValueContract } from '@/utils/payroll-forms-settings';
import moment from 'moment';
import { Switch } from '@/components/ui/switch';
import Period from './period';
import MinMaxHours from './min-max-hours';
import PaymentDetails from './payment-details';
import Schedules from './schedules';
import Extensions from './extensions';
import Policies from './policies';
import axiosInstance from '@/services/axios';
import { toast } from 'sonner';

type Props = {
  defaultContract: UserContractType;
  onBack?: () => void;
};

const EditContractFormik = createContext<{ formik?: FormikProps<any> }>({
  formik: undefined,
});

export const useContractFormik = () => useContext(EditContractFormik);

export default function EditContract2({ defaultContract, onBack }: Props) {
  const { startLoading, stopLoading, isLoading } = useLoading();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: defaultContract
      ? {
          ...defaultContract,
          end_at: moment(defaultContract.end_at).format('YYYY-MM-DD'),
          start_at: moment(defaultContract.start_at).format('YYYY-MM-DD'),
        }
      : initialValueContract,
    validationSchema: Yup.object().shape({}),
    onSubmit: (values) => {
      const payload: { [key: string]: any } = { ...values };
      if (payload.schedule) delete payload.schedule;
      if (payload.text) delete payload.text;

      startLoading();
      axiosInstance({
        method: 'put',
        url: `/contracts/${defaultContract.id}`,
        data: payload,
      })
        .then((res) => {
          stopLoading();
          toast.success('Contract has been updated.');
        })
        .catch((res) => {
          stopLoading();
        });
    },
  });

  const { values, touched, errors, isValid, setFieldValue, handleSubmit } =
    formik;

  const StaticItems: { title: string; content: ReactNode }[] = [
    { title: 'Parties', content: <ContractParties /> },
    { title: 'Period', content: <Period /> },
    { title: 'Min & Max Hours', content: <MinMaxHours /> },
    { title: 'Payment Details', content: <PaymentDetails /> },
    { title: 'Schedule(s)', content: <Schedules /> },
    { title: 'Extensions', content: <Extensions /> },
    { title: 'Policies', content: <Policies /> },
  ];

  const handleToggleContentAvailbility = (
    index: number,
    addOrSubtract: boolean,
  ) => {
    const prevContent = values?.content ?? [];

    if (addOrSubtract === true) {
      setFieldValue('content', [...new Set([...prevContent, index])]);
    } else {
      setFieldValue('content', [
        ...new Set(prevContent?.filter((item) => item !== index)),
      ]);
    }
  };

  return (
    <BoxHolder title="Edit Contract" onClose={onBack}>
      <EditContractFormik.Provider value={{ formik }}>
        <form onSubmit={handleSubmit}>
          <Accordion type="single" collapsible className="w-full">
            {StaticItems.map((item, index) => {
              const properIndex = index + 1;

              const clauseEnabled = values?.content?.includes(properIndex);

              return (
                <AccordionItem value={`item-${properIndex}`} key={properIndex}>
                  <AccordionTrigger>{item.title}</AccordionTrigger>
                  <AccordionContent className="px-1 flex flex-col gap-y-4">
                    <div className="flex flex-row items-center gap-4">
                      <Switch
                        id={`enable-item-${index}`}
                        checked={clauseEnabled}
                        onCheckedChange={(value) =>
                          handleToggleContentAvailbility(properIndex, value)
                        }
                      />
                      <span>{`${clauseEnabled ? 'Disable' : 'Enable'} this clause`}</span>
                    </div>
                    {item.content}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
          <CotopiaButton
            type="submit"
            disabled={!isValid || isLoading}
            className="w-full"
            loading={isLoading}
          >
            {defaultContract ? 'Edit contract' : 'Create a new contract'}
          </CotopiaButton>
        </form>
      </EditContractFormik.Provider>
    </BoxHolder>
  );
}
