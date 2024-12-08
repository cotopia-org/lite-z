import CotopiaButton from "@/components/shared-ui/c-button";
import { useAppSelector } from "@/store";
import { useFormik } from "formik";
import { useEffect, useReducer, useCallback, useState } from "react";
import {
  initialValuePayments,
  validationSchemaPayments,
} from "@/utils/payroll-forms-settings";
import { fetchEmployeesData, fetchUserContract } from "@/utils/payroll";
import PaymentsInputs from "./components/payments-inputs";
import { PayrollInitialState, payrollReducer } from "./state";
import { useCreatePayment } from "@/hooks/use-create-payments";
import UserSelector from "@/components/shared/user-selector";
import { UserMinimalType } from "@/types/user";
import { PaymentType } from "@/types/payment";
import { ChevronLeft } from "lucide-react";

type Props = {
  defaultValue?: PaymentType;
  onBack?: () => void;
};

export default function PayrollCreatePayments({ defaultValue, onBack }: Props) {
  const { updatePayment, createPayment, loading } = useCreatePayment();
  const [state, dispatch] = useReducer(payrollReducer, PayrollInitialState);
  const userData = useAppSelector((store) => store.auth);
  const [selectedUser, setSelectedUser] = useState<UserMinimalType | null>(
    null
  );

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const data = await fetchEmployeesData(userData.accessToken!);

        const normalizedData = data.map((employee: any) => ({
          id: employee.id?.toString(),
          name: employee.name || "no name",
          username: employee.username,
          avatar: employee.avatar || { url: "" },
        }));

        dispatch({ type: "SET_EMPLOYEES", payload: normalizedData });
      } catch (error) {
        console.error("Error fetching employees data:", error);
      }
    }

    if (userData.accessToken) {
      fetchEmployees();
    }
  }, [userData.accessToken]);

  const getUserContract = useCallback(
    async (id: number) => {
      try {
        const contract = await fetchUserContract(+id, userData.accessToken!);

        if (contract) {
          dispatch({ type: "SET_CONTRACT_ID_ERROR", payload: null });
          dispatch({ type: "SET_USER_CONTRACT", payload: contract });
        } else {
          dispatch({
            type: "SET_CONTRACT_ID_ERROR",
            payload: "User does not have a contract.",
          });
          dispatch({ type: "SET_USER_CONTRACT", payload: null });
        }
      } catch (error) {
        console.error("Error fetching user contract:", error);
        dispatch({ type: "SET_USER_CONTRACT", payload: null });
      }
    },
    [userData.accessToken]
  );

  const handleUserIdChange = useCallback(
    async (id: string) => {
      const employee = state.employees.find((emp) => emp.id === id);
      if (!employee) {
        dispatch({ type: "SET_USER_ID_ERROR", payload: "User ID not found" });
        dispatch({ type: "SET_SELECTED_EMPLOYEE", payload: null });
        dispatch({ type: "SET_USER_CONTRACT", payload: null });
      } else {
        dispatch({ type: "SET_USER_ID_ERROR", payload: null });
        dispatch({ type: "SET_SELECTED_EMPLOYEE", payload: employee });
        getUserContract(+id);
      }
    },
    [state.employees, getUserContract]
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: defaultValue
      ? {
          type: defaultValue?.type,
          status: defaultValue?.status,
          bonus: defaultValue?.bonus,
          round: defaultValue?.round,
          total_amount: defaultValue
            ? (defaultValue?.amount ?? 0) *
              (+defaultValue?.total_hours?.sum_hours + defaultValue?.bonus)
            : 0,
          total_hours: defaultValue?.total_hours?.sum_minutes
            ? defaultValue.total_hours.sum_minutes / 60
            : 0,
          contract_id: defaultValue?.contract_id,
          user_id: defaultValue?.user?.id,
        }
      : initialValuePayments,
    validationSchema: validationSchemaPayments,
    onSubmit: (values) => {
      if (state.userContract?.id) {
        const finalPayload = {
          status: +values.status ? "Paid" : "Not paid",
          amount: +values.total_amount,
          bonus: +values.bonus,
          round: +values.round,
          total_hours: +values.total_hours,
          user_id: selectedUser?.id!,
          contract_id: state.userContract.id,
          type: values.type,
        };

        if (defaultValue !== undefined) {
          updatePayment(defaultValue.id, finalPayload);
        } else {
          createPayment(finalPayload);
        }
      }
    },
  });

  const {
    touched,
    errors,
    getFieldProps,
    setFieldValue,
    handleSubmit,
    isValid,
    values,
  } = formik;

  return (
    <form
      onSubmit={handleSubmit}
      className='w-full p-4 flex flex-col gap-y-8 items-center'
    >
      <div className='w-full grid grid-cols-2 gap-x-4 gap-y-4'>
        <PaymentsInputs
          errors={errors}
          touched={touched}
          getFieldProps={getFieldProps}
          setFieldValue={setFieldValue}
          userContract={state.userContract}
          values={values}
          selectedUser={selectedUser!}
        />

        {!!!defaultValue && (
          <UserSelector
            label={false}
            onPick={(user) => {
              setSelectedUser(user);
              handleUserIdChange(user.id.toString());
            }}
            disabled
          />
        )}
      </div>

      <CotopiaButton
        type='submit'
        disabled={!isValid || loading}
        className='w-full'
        loading={loading}
      >
        {defaultValue ? "Update" : "Create a new payment"}
      </CotopiaButton>

      {!!onBack && (
        <CotopiaButton
          variant={"link"}
          startIcon={<ChevronLeft />}
          onClick={onBack}
        >
          Close Payment
        </CotopiaButton>
      )}
    </form>
  );
}
