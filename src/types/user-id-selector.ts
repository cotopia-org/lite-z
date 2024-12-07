export interface UserIdSelectorProps {
    employees: Array<{ id: string; name: string; avatar: { url: string } }>;
    selectedEmployee: { id: string; name: string; avatar: { url: string } } | null;
    userIdError: string | null;
    contractIdError: string | null;
    handleUserIdChange: (id: string) => void;
    touched: boolean | undefined;
    error: string | undefined;
    value: string;
    setFieldValue: (field: string, value: any) => void;
}