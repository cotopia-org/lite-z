import UserAvatar from "@/components/shared/user-avatar";

export function TableAvatar({ avatarUrl, userName }: { avatarUrl: string, userName: string }) {
    return (
      <UserAvatar src={avatarUrl} title={userName} />
    );
  }