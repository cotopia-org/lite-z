import React, { useMemo } from 'react';
import { useContractFormik } from '.';
import UserSelector from '@/components/shared/user-selector';
import { useRoomContext } from '@/components/shared/room/room-context';

export default function ContractParties() {
  const { formik } = useContractFormik();

  const { workspaceUsers } = useRoomContext();

  const targetContractUser = useMemo(() => {
    return workspaceUsers.find((a) => a.id === formik?.values?.user_id);
  }, [workspaceUsers, formik?.values?.user_id]);

  return (
    <div className="flex flex-row items-center gap-4 flex-wrap">
      <UserSelector
        defaultSelectedId={formik?.values?.user?.id}
        onPick={(item) => formik?.setFieldValue('user', item)}
        //@ts-ignore
        defaultUser={targetContractUser}
        label
      />
    </div>
  );
}
