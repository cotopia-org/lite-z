import CotopiaButton from "@/components/shared-ui/c-button";
import CotopiaInput from "@/components/shared-ui/c-input";
import UserAvatar from "@/components/shared/user-avatar";
import { useAppSelector } from "@/store";
import { EmployeesRowData } from "@/types/payroll-table";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";


export default function PayrollCreateContract() {
    const [employees, setEmployees] = useState<EmployeesRowData[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeesRowData | null>(null);
    const [userIdError, setUserIdError] = useState<string | null>(null);
    const userData = useAppSelector((store) => store.auth);

    useEffect(() => {
        async function fetchEmployees() {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_PUBLIC_API_URL}/workspaces/1/users`,
                    {
                        headers: {
                            Authorization: `Bearer ${userData.accessToken}`,
                        },
                    }
                );

                const data = response.data.data;

                const normalizedData = data.map((employee: any) => ({
                    id: employee.id?.toString(),
                    name: employee.name || "no name",
                    username: employee.username,
                    email: employee.email || "No Email",
                    status: employee.status,
                    last_login: new Date(employee.last_login).toLocaleDateString(),
                    active_job: employee.active_job || { title: "No Active Job" },
                    avatar: employee.avatar,
                    user_contract: "Show contract",
                }));

                setEmployees(normalizedData);
            } catch (error) {
                console.error("Error fetching employees data:", error);
            }
        }

        fetchEmployees();
    }, [userData.accessToken]);

    const handleUserIdChange = (id: string) => {
        const employee = employees.find((emp) => emp.id === id);
        if (!employee) {
            setUserIdError("User ID not found");
            setSelectedEmployee(null);
        } else {
            setUserIdError(null);
            setSelectedEmployee(employee);
        }
    };

    const validationSchema = Yup.object().shape({
        userId: Yup.string()
            .required("User ID is required")
            .matches(/^\d+$/, "User ID must be a number"),
        type: Yup.string().required("Contract type is required"),
        amount: Yup.number()
            .required("Amount is required")
            .min(1, "Amount must be at least 1"),
        minHours: Yup.number()
            .required("Min hours is required")
            .min(1, "Min hours must be at least 1"),
        maxHours: Yup.number()
            .required("Max hours is required")
            .min(1, "Max hours must be at least 1"),
        paymentMethod: Yup.string().required("Payment method is required"),
        paymentAddress: Yup.string().required("Payment address is required"),
        userRole: Yup.string().required("User role is required"),
        autoRenewal: Yup.string().required("Auto renewal is required"),
    });

    const { isSubmitting, touched, errors, getFieldProps, handleSubmit, isValid } =
        useFormik({
            enableReinitialize: true,
            initialValues: {
                userId: "",
                type: "",
                amount: "",
                minHours: "",
                maxHours: "",
                paymentMethod: "",
                paymentAddress: "",
                userRole: "",
                autoRenewal: "",
            },
            validationSchema,
            onSubmit: (values) => {
                console.log(values);
                // axios.post(`${process.env.REACT_APP_PUBLIC_API_URL}/contracts/`, {

                // } as UserContractType, {
                //     headers: {
                //         Authorization: `Bearer ${userData.accessToken}`,
                //     },
                // }) 
            },
        });

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full p-4 flex flex-col gap-y-8 items-center"
        >
            <div className="w-full grid grid-cols-2 gap-x-4 gap-y-4">

                <CotopiaInput
                    {...getFieldProps("type")}
                    placeholder="Enter the type"
                    label="Contract type"
                    hasError={!!touched.type && !!errors.type}
                    helperText={touched.type && errors.type}
                />

                <CotopiaInput
                    {...getFieldProps("amount")}
                    placeholder="Enter the amount"
                    label="Amount"
                    type="number"
                    hasError={!!touched.amount && !!errors.amount}
                    helperText={touched.amount && errors.amount}
                />

                <CotopiaInput
                    {...getFieldProps("minHours")}
                    placeholder="Enter the min hours"
                    label="Min hours"
                    type="number"
                    hasError={!!touched.minHours && !!errors.minHours}
                    helperText={touched.minHours && errors.minHours}
                />

                <CotopiaInput
                    {...getFieldProps("maxHours")}
                    placeholder="Enter the max hours"
                    label="Max hours"
                    type="number"
                    hasError={!!touched.maxHours && !!errors.maxHours}
                    helperText={touched.maxHours && errors.maxHours}
                />

                <CotopiaInput
                    {...getFieldProps("paymentMethod")}
                    placeholder="Enter the payment method"
                    label="Payment method"
                    hasError={!!touched.paymentMethod && !!errors.paymentMethod}
                    helperText={touched.paymentMethod && errors.paymentMethod}
                />

                <CotopiaInput
                    {...getFieldProps("paymentAddress")}
                    placeholder="Enter the payment address"
                    label="Payment address"
                    hasError={!!touched.paymentAddress && !!errors.paymentAddress}
                    helperText={touched.paymentAddress && errors.paymentAddress}
                />

                <CotopiaInput
                    {...getFieldProps("userRole")}
                    placeholder="Enter the user role"
                    label="User role"
                    hasError={!!touched.userRole && !!errors.userRole}
                    helperText={touched.userRole && errors.userRole}
                />

                <CotopiaInput
                    {...getFieldProps("autoRenewal")}
                    placeholder="Enter the auto renewal ( 1 - 0 )"
                    label="Contract auto renewal"
                    hasError={!!touched.autoRenewal && !!errors.autoRenewal}
                    helperText={touched.autoRenewal && errors.autoRenewal}
                />

                <CotopiaInput
                    {...getFieldProps("userId")}
                    placeholder="Enter the user ID"
                    label="User ID"
                    onChange={(e) => {
                        getFieldProps("userId").onChange(e);
                        handleUserIdChange(e.target.value);
                    }}
                    hasError={!!touched.userId && (!!errors.userId || !!userIdError)}
                    helperText={(touched.userId && errors.userId) || userIdError || ''}
                />

                {selectedEmployee && (
                    <div className="flex items-center gap-x-4 col-span-2">
                        <UserAvatar src={selectedEmployee.avatar?.url} title={selectedEmployee.username} />
                        <span>{selectedEmployee.name}</span>
                    </div>
                )}
            </div>

            <CotopiaButton
                loading={isSubmitting}
                type="submit"
                disabled={!isValid || isSubmitting || !!userIdError}
                className="w-full"
            >
                Create a new contract
            </CotopiaButton>
        </form>
    );
}