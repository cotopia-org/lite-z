import CotopiaButton from "@/components/shared-ui/c-button";
import { useAppSelector } from "@/store";
import { useFormik } from "formik";
import { useEffect, useCallback, useReducer, useState } from "react";
import { initialValueContract, validationSchemaContract } from "@/utils/payroll-forms-settings";
import PayrollContractInputs from "./components/contract-inputs";
import { fetchEmployeesData, fetchUserContract } from "@/utils/payroll";
import { PayrollInitialState, payrollReducer } from "../create-payments/state";
import useCreateContract from "@/hooks/use-create-contract";
import UserSelector from "@/components/shared/user-selector";
import { UserMinimalType } from "@/types/user";

export default function PayrollCreateContract() {
    const [state, dispatch] = useReducer(payrollReducer, PayrollInitialState);
    const userData = useAppSelector((store) => store.auth);
    const [selectedUser, setSelectedUser] = useState<UserMinimalType | null>(null);
    const { createContract, loading } = useCreateContract();

    useEffect(() => {
        const fetchEmployees = async () => {
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
        };

        if (userData.accessToken) {
            fetchEmployees();
        }

    }, [userData.accessToken]);

    const getUserContract = useCallback(
        async (id: number) => {
            try {
                const contract = await fetchUserContract(id, userData.accessToken!);

                if (contract) {
                    dispatch({ type: "SET_CONTRACT_ID_ERROR", payload: "User does have a contract." });
                    dispatch({ type: "SET_USER_CONTRACT", payload: contract });
                } else {
                    dispatch({ type: "SET_CONTRACT_ID_ERROR", payload: null });
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
        initialValues: initialValueContract,
        validationSchema: validationSchemaContract,
        onSubmit: (values) => {
            createContract({ values, userId: +selectedUser?.id! });
        },
    });

    const { touched, errors, getFieldProps, handleSubmit, isValid } = formik;

    return (
        <form onSubmit={handleSubmit} className="w-full p-4 flex flex-col gap-y-8 items-center">
            <div className="w-full grid grid-cols-2 gap-x-4 gap-y-4">
                <PayrollContractInputs errors={errors} getFieldProps={getFieldProps} touched={touched} selectedUser={selectedUser!}
                />

                <UserSelector
                    label={false}
                    onPick={(user) => {
                        setSelectedUser(user);
                        handleUserIdChange(user.id.toString());
                    }}
                />
            </div>

            <CotopiaButton
                type="submit"
                disabled={!isValid || loading}
                className="w-full"
            >
                {loading ? "Creating..." : "Create a new contract"}
            </CotopiaButton>
        </form>
    );
}
