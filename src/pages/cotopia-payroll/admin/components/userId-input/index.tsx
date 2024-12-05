import { useCallback } from "react";
import CotopiaInput from "@/components/shared-ui/c-input";
import UserAvatar from "@/components/shared/user-avatar";
import { UserIdSelectorProps } from "@/types/user-id-selector";

const UserIdSelector = ({
    employees,
    selectedEmployee,
    userIdError,
    contractIdError,
    handleUserIdChange,
    touched,
    error,
    value,
    setFieldValue,
}: UserIdSelectorProps) => {
    const onChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setFieldValue("user_id", e.target.value);
            handleUserIdChange(e.target.value);
        },
        [setFieldValue, handleUserIdChange]
    );

    return (
        <div className="w-full">
            <CotopiaInput
                value={value}
                placeholder="Enter the user ID"
                label="User ID"
                type="number"
                onChange={onChange}
                hasError={!!touched && (!!error || !!userIdError)}
                helperText={(touched && error) || userIdError || contractIdError || ""}
            />

            {selectedEmployee && (
                <div className="flex items-center gap-x-4 mt-4">
                    <UserAvatar
                        src={selectedEmployee.avatar.url || ""}
                        title={selectedEmployee.name}
                    />
                    <span>{selectedEmployee.name}</span>
                </div>
            )}
        </div>
    );
};

export default UserIdSelector;
