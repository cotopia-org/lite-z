import UserActionsAvatarButton from "../../../../components/shared/user-actions-avatar-button";
import UserActionsMenuButton from "./sidebar-menu";

export default function UserActions() {
  return (
    <div className='flex flex-row items-center gap-x-4'>
      <UserActionsAvatarButton />
      <UserActionsMenuButton />
    </div>
  );
}
