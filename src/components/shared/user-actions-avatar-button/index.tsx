import CotopiaAvatar from "@/components/shared-ui/c-avatar";
import { FullModalBox } from "@/components/shared/modal-box";
import { getUserFullname } from "@/lib/utils";
import UserSettings from "./settings";
import useAuth from "@/hooks/auth";

type Props = {
  size?: "normal" | "large";
};

export default function UserActionsAvatarButton({ size = "large" }: Props) {
  const { user } = useAuth();

  if (!user) return null;

  let userFullName = getUserFullname(user);

  let avatarClss = "cursor-pointer";

  switch (size) {
    case "large":
      avatarClss += ` w-[40px] h-[40px] border text-xl`;
      break;
    case "normal":
      avatarClss += ` w-[32px] h-[32px] border text-lg`;
      break;
  }

  return (
    <FullModalBox
      trigger={(open) => (
        <CotopiaAvatar
          date={user?.created_at}
          src={user?.avatar?.url ?? undefined}
          title={userFullName?.[0]}
          className={avatarClss}
          onClick={open}
        />
      )}
      className="w-[640px]"
    >
      {(open, close) => <UserSettings />}
    </FullModalBox>
  );
}
