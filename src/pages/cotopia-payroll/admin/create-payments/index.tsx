import CotopiaButton from "@/components/shared-ui/c-button";
import CotopiaInput from "@/components/shared-ui/c-input";
import UserAvatar from "@/components/shared/user-avatar";
import { useAppSelector } from "@/store";
import { UserContractType } from "@/types/contract";
import { EmployeesRowData } from "@/types/payroll-table";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import * as Yup from "yup";

const fetchEmployeesData = async (token: string) => {
    const { data } = await axios.get(`${process.env.REACT_APP_PUBLIC_API_URL}/workspaces/1/users`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data.data.map((employee: any) => ({
        id: employee.id?.toString(),
        name: employee.name || "No name",
        username: employee.username,
        avatar: employee.avatar,
    }));
};

const fetchUserContract = async (userId: string, token: string) => {
    const { data } = await axios.get(`${process.env.REACT_APP_PUBLIC_API_URL}/contracts`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data.data.find((contract: UserContractType) => contract.user_id === parseInt(userId));
};

const PayrollCreatePayments = () => {
    const [employees, setEmployees] = useState<EmployeesRowData[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeesRowData | null>(null);
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
        loadEmployees();
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
        userId: Yup.string()
            .required("User ID is required")
            .matches(/^\d+$/, "User ID must be a number"),
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
               
                <CotopiaInput
                    {...formik.getFieldProps("type")}
                    placeholder="Enter the type"
                    label="Payment type"
                    hasError={formik.touched.type && !!formik.errors.type}
                    helperText={formik.touched.type && formik.errors.type}
                />

                <CotopiaInput
                    value={contractAmount || ""}
                    placeholder="Calculated amount"
                    label="Amount"
                    type="number"
                    disabled
                />

                <CotopiaInput
                    {...formik.getFieldProps("hours")}
                    placeholder="Enter the hours"
                    label="Hours"
                    type="number"
                    hasError={formik.touched.hours && !!formik.errors.hours}
                    helperText={formik.touched.hours && formik.errors.hours}
                />

                <CotopiaInput
                    value={calculatedTotalAmount || ""}
                    placeholder="Total amount"
                    label="Total amount"
                    type="number"
                    disabled
                />

                <CotopiaInput
                    {...formik.getFieldProps("bonus")}
                    placeholder="Enter the bonus"
                    label="Bonus"
                    type="number"
                    hasError={formik.touched.bonus && !!formik.errors.bonus}
                    helperText={formik.touched.bonus && formik.errors.bonus}
                />

                <CotopiaInput
                    {...formik.getFieldProps("userId")}
                    placeholder="Enter the user ID"
                    label="User ID"
                    onChange={(e) => {
                        formik.getFieldProps("userId").onChange(e);
                        handleUserIdChange(e.target.value);
                    }}
                    hasError={!!(formik.touched.userId && (formik.errors.userId || userError || contractError))}
                    helperText={formik.touched.userId && formik.errors.userId || userError || contractError || ""}
                />
                {selectedEmployee && (
                    <div className="flex items-center gap-x-4 col-span-2">
                        <UserAvatar src={selectedEmployee.avatar?.url} title={selectedEmployee.username} />
                        <span>{selectedEmployee.name}</span>
                    </div>
                )}
            </div>

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