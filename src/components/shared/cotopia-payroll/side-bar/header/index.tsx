import { useAppSelector } from "@/store";
import UserAvatar from "@/components/shared/user-avatar";
import { FullModalBox } from "@/components/shared/modal-box";
import PayrollUserSettings from "../../user-information/settings";
import { isUserAdmin } from "@/lib/utils";
import { useRoomContext } from "@/components/shared/room/room-context";

export default function PayrollSideBarHeader() {
  const { workspace_id } = useRoomContext();

  const user = useAppSelector((store) => store.auth.user);
  const isAdmin = isUserAdmin(user, workspace_id ? +workspace_id : undefined);
  return (
    <FullModalBox
      trigger={(open) => (
        <div
          onClick={open}
          className="w-full p-3 flex items-center justify-between border-b border-border"
        >
          <div className="flex items-center gap-x-2">
            <UserAvatar
              date={user?.created_at}
              src={user?.avatar?.url}
              title={user?.username!}
              className="w-10 h-10"
            />
            <h1 className="text-base font-semibold">{user?.username}</h1>
          </div>

          {isAdmin ? (
            <p className="text-sm font-semibold text-gray-600">Admin</p>
          ) : (
            <p className="text-sm font-semibold text-gray-600">User</p>
          )}
        </div>
      )}
      className="w-[640px]"
    >
      {(open, close) => <PayrollUserSettings />}
    </FullModalBox>
  );
}
