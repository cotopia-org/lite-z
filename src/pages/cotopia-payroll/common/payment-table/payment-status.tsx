import CotopiaSwitch from '@/components/shared-ui/c-switch';
import { useRoomContext } from '@/components/shared/room/room-context';
import { useLoading } from '@/hooks';
import useAuth from '@/hooks/auth';
import { isUserAdmin } from '@/lib/utils';
import axiosInstance from '@/services/axios';
import { PaymentType } from '@/types/payment';
import { useEffect, useState } from 'react';

type Props = {
  payment: PaymentType;
  onChange: () => void;
};

enum PaymentStatusEnum {
  Paid = 'paid',
  Pending = 'pending',
}

export default function PaymentStatus({ payment, onChange }: Props) {
  const { workspace_id } = useRoomContext();

  const { user } = useAuth();
  const isAdmin = isUserAdmin(user, workspace_id ? +workspace_id : undefined);

  const [status, setStatus] = useState<string>();
  useEffect(() => {
    if (payment?.status) setStatus(payment.status);
  }, [payment?.status]);

  const { startLoading, stopLoading, isLoading } = useLoading();

  const updateStatus = (value: boolean) => {
    startLoading();
    axiosInstance
      .put(`/payments/${payment.id}`, {
        status: value ? PaymentStatusEnum.Paid : PaymentStatusEnum.Pending,
      })
      .then((res) => {
        setStatus(
          value === true ? PaymentStatusEnum.Paid : PaymentStatusEnum.Pending,
        );
        stopLoading();
        if (onChange) onChange();
      })
      .catch((err) => {
        stopLoading();
      });
  };

  return (
    <CotopiaSwitch
      label={status === PaymentStatusEnum.Paid ? 'Paid' : 'Pending'}
      checked={status === PaymentStatusEnum.Paid}
      onCheckedChange={(value) => updateStatus(value)}
      disabled={isLoading || !isAdmin}
    />
  );
}
