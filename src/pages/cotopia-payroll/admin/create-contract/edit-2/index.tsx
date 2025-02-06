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
import PaymentDetails from './payment-details';
import Schedules from './schedules';
import Extensions from './extensions';
import Policies from './policies';
import axiosInstance from '@/services/axios';
import { toast } from 'sonner';
import MinHours from './min-hours';
import MaxHours from './max-hours';
import { useRoomContext } from '@/components/shared/room/room-context';
import InJob from './InJob';

type Props = {
  defaultContract?: UserContractType;
  onBack?: () => void;
  onUpdate?: () => void;
};

const EditContractFormik = createContext<{ formik?: FormikProps<any> }>({
  formik: undefined,
});

export const useContractFormik = () => useContext(EditContractFormik);

export default function ManageContract({
  defaultContract,
  onBack,
  onUpdate,
}: Props) {
  const { workspace_id } = useRoomContext();

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
    onSubmit: (values: any) => {
      let payload: { [key: string]: any } = {
        ...values,
        user_id: values?.user?.id,
        workspace_id,
      };

      if (payload.schedule) delete payload.schedule;
      if (payload.text) delete payload.text;
      if (payload.user) delete payload.user;
      if (payload.schedule) payload['schedule_id'] = payload.schedule.id;

      startLoading();
      axiosInstance({
        method: defaultContract ? 'put' : 'post',
        url: !defaultContract
          ? `/contracts`
          : `/contracts/${defaultContract.id}`,
        data: payload,
      })
        .then((res) => {
          stopLoading();
          toast.success(
            `Contract has been ${defaultContract ? 'updated' : 'created'}.`,
          );
          if (onBack && !defaultContract) onBack();
          if (defaultContract) {
            if (onUpdate) onUpdate();
          }
        })
        .catch((res) => {
          stopLoading();
        });
    },
  });

  const { values, isValid, setFieldValue, handleSubmit } = formik;

  const StaticItems: { title: string; content: ReactNode }[] = [
    { title: 'Parties', content: <ContractParties /> },
    { title: 'Period', content: <Period /> },
    { title: 'Min', content: <MinHours /> },
    { title: 'Max', content: <MaxHours /> },
    { title: 'Payment Details', content: <PaymentDetails /> },
    { title: 'Renewal', content: <Extensions /> },
    { title: 'In Job', content: <InJob /> },
    { title: 'Schedule(s)', content: <Schedules /> },
    { title: 'Disclosure', content: <Policies /> },
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
        ...new Set(prevContent?.filter((item: any) => item !== index)),
      ]);
    }
  };

  return (
    <BoxHolder
      title={defaultContract ? `Edit Contract` : `Create Contract`}
      onClose={onBack}
    >
      <EditContractFormik.Provider value={{ formik }}>
        <form onSubmit={handleSubmit}>
          <Accordion type="single" collapsible className="w-full">
            {StaticItems.map((item, index) => {
              const properIndex = index + 1;
              const clauseEnabled = values?.content?.includes(properIndex);
              return (
                <AccordionItem value={`item-${properIndex}`} key={properIndex}>
                  <AccordionTrigger>
                    <div className="flex flex-row items-center gap-x-2">
                      <Switch
                        id={`enable-item-${index}`}
                        checked={clauseEnabled}
                        onCheckedChange={(value) =>
                          handleToggleContentAvailbility(properIndex, value)
                        }
                      />
                      {item.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-1 flex flex-col gap-y-4">
                    {!!clauseEnabled && item.content}
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
