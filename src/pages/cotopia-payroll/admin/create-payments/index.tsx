import CotopiaButton from "@/components/shared-ui/c-button";
import { useAppSelector } from "@/store";
import { useFormik } from "formik";
import { useEffect, useReducer, useCallback } from "react";
import { initialValuePayments, validationSchemaPayments } from "@/utils/payroll-forms-settings";
import { fetchEmployeesData, fetchUserContract } from "@/utils/payroll";
import PaymentsInputs from "./components/payments-inputs";
import { PayrollInitialState, payrollReducer } from "./state";
import { useCreatePayment } from "@/hooks/use-create-payments";
import UserIdSelector from "../components/userId-input";

export default function PayrollCreatePayments() {
    const createPayment = useCreatePayment();
    const [state, dispatch] = useReducer(payrollReducer, PayrollInitialState);
    const userData = useAppSelector((store) => store.auth);

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
                    dispatch({ type: "SET_CONTRACT_ID_ERROR", payload: "User does not have a contract." });
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
        initialValues: initialValuePayments,
        validationSchema: validationSchemaPayments,
        onSubmit: (values) => {
            if (state.userContract?.id) {
                createPayment({
                    status: "paid",
                    amount: +values.total_amount,
                    bonus: +values.bonus,
                    round: +values.round,
                    total_hours: +values.total_hours,
                    user_id: +values.user_id,
                    contract_id: state.userContract.id,
                    type: values.type,
                });
            }
        },
    });

    const { touched, errors, getFieldProps, handleSubmit, isValid, values } = formik;

    return (
        <form onSubmit={handleSubmit} className="w-full p-4 flex flex-col gap-y-8 items-center">

            <div className="w-full grid grid-cols-2 gap-x-4 gap-y-4">
                <PaymentsInputs
                    errors={errors}
                    touched={touched}
                    getFieldProps={getFieldProps}
                    userContract={state.userContract}
                    values={values}
                />

                <UserIdSelector
                    employees={state.employees}
                    selectedEmployee={state.selectedEmployee}
                    userIdError={state.userIdError}
                    contractIdError={state.contractIdError}
                    handleUserIdChange={handleUserIdChange}
                    touched={touched.user_id}
                    error={errors.user_id}
                    value={values.user_id}
                    setFieldValue={formik.setFieldValue}
                />
            </div>

            <CotopiaButton
                type="submit"
                disabled={!isValid || !state.userContract}
                className="w-full"
            >
                {!state.userContract
                    ? "Please create a contract first before submitting payments."
                    : "Create a new payment"}
            </CotopiaButton>
        </form>
    );
}