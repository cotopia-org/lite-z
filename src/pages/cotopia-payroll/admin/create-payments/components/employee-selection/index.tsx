import CotopiaInput from "@/components/shared-ui/c-input";

interface EmployeeSelectionProps {
    employees: any;
    onUserIdChange: (id: string) => void;
    userError: string | null;
    contractError: string | null;
}

const EmployeeSelection = ({ employees, onUserIdChange, userError, contractError }: EmployeeSelectionProps) => (
    <CotopiaInput
        placeholder="Enter the user ID"
        label="User ID"
        onChange={(e) => onUserIdChange(e.target.value)}
        hasError={!!(userError || contractError)}
        helperText={userError || contractError || ""}
    />
);

export default EmployeeSelection;
