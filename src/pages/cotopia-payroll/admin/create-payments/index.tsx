import { useEffect, useState, useMemo, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import axios from "axios";
import CotopiaButton from "@/components/shared-ui/c-button";
import { useAppSelector } from "@/store";
import { fetchEmployeesData, fetchUserContract } from "@/utils/payroll";
import EmployeeSelection from "./components/employee-selection";
import PaymentDetails from "./components/payment-details";
import UserAvatarSection from "./components/user-avatar-section";

function PayrollCreatePayments() {
    const [employees, setEmployees] = useState<any[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
    const [contractAmount, setContractAmount] = useState<number | null>(null);
    const [contractId, setContractId] = useState<number | null>(null);
    const [userError, setUserError] = useState<string | null>(null);
    const [contractError, setContractError] = useState<string | null>(null);

    const userData = useAppSelector((store) => store.auth);

    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const employeesData = await fetchEmployeesData(userData.accessToken!);
                setEmployees(employeesData);
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        };
        if (userData.accessToken) {
            loadEmployees();
        }
    }, [userData.accessToken]);

    const handleUserIdChange = useCallback(async (id: string) => {
        const employee = employees.find((emp) => emp.id === id);
        if (!employee) {
            setUserError("User ID not found");
            setSelectedEmployee(null);
        } else {
            setUserError(null);
            setSelectedEmployee(employee);
            const contract = await fetchUserContract(id, userData.accessToken!);
            if (contract) {
                setContractAmount(contract.amount);
                setContractId(contract.id);
                setContractError(null);
            } else {
                setContractAmount(null);
                setContractError("No contract found for this user.");
                toast.error("No contract found for this user.");
            }
        }
    }, [employees, userData.accessToken]);

    const validationSchema = Yup.object({
        type: Yup.string().required("Payment type is required"),
        userId: Yup.string().required("User ID is required").matches(/^\d+$/, "User ID must be a number"),
        hours: Yup.number().required("Hours is required").min(1, "Hours must be at least 1"),
        bonus: Yup.number().min(0, "Bonus cannot be negative"),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            userId: "",
            type: "",
            hours: "",
            totalAmount: "",
            bonus: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await axios.post(`${process.env.REACT_APP_PUBLIC_API_URL}/payments`, {
                    status: 0,
                    amount: Number(values.totalAmount),
                    bonus: Number(values.bonus),
                    round: 0,
                    total_hours: Number(values.hours),
                    user_id: values.userId,
                    contract_id: contractId,
                    type: values.type,
                }, {
                    headers: { Authorization: `Bearer ${userData.accessToken}` },
                });
                toast.success("Payment created successfully!");
                setSelectedEmployee(null);
                formik.resetForm();
            } catch (error) {
                toast.error("Failed to create the payment.");
                console.error("Error creating payment:", error);
            }
        },
    });

    const calculatedTotalAmount = useMemo(() => {
        if (formik.values.hours && contractAmount !== null) {
            return (Number(formik.values.hours) * contractAmount) + (Number(formik.values.bonus) || 0);
        }
        return 0;
    }, [formik.values.hours, formik.values.bonus, contractAmount]);

    useEffect(() => {
        formik.setFieldValue("totalAmount", calculatedTotalAmount);
    }, [calculatedTotalAmount, formik]);

    return (
        <form onSubmit={formik.handleSubmit} className="w-full h-screen p-4 flex flex-col gap-y-8 items-center justify-center">

            <div className="w-full grid grid-cols-2 gap-x-4 gap-y-4">
                <EmployeeSelection
                    employees={employees}
                    onUserIdChange={handleUserIdChange}
                    userError={userError}
                    contractError={contractError}
                />

                <PaymentDetails
                    formik={formik}
                    contractAmount={contractAmount}
                    calculatedTotalAmount={calculatedTotalAmount}
                />
            </div>

            <UserAvatarSection selectedEmployee={selectedEmployee} />

            <CotopiaButton
                loading={formik.isSubmitting}
                type="submit"
                disabled={!formik.isValid || formik.isSubmitting || !!userError || !!contractError}
                className="w-full"
            >
                {contractError ? "No contract found, please create one first" : "Create a new payment"}
            </CotopiaButton>
        </form>
    );
};

export default PayrollCreatePayments;
