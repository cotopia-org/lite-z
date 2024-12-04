import UserAvatar from "@/components/shared/user-avatar";

interface UserAvatarSectionProps {
    selectedEmployee: any;
}

const UserAvatarSection = ({ selectedEmployee }: UserAvatarSectionProps) => (
    selectedEmployee && (
        <div className="flex items-center gap-x-4">
            <UserAvatar src={selectedEmployee.avatar?.url} title={selectedEmployee.username} />
            <span>{selectedEmployee.name}</span>
        </div>
    )
);

export default UserAvatarSection;
