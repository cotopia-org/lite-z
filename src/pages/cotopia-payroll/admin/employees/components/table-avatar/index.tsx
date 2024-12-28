import UserAvatar from "@/components/shared/user-avatar";

export function TableAvatar({
  avatarUrl,
  userName,
  date,
}: {
  avatarUrl: string;
  userName: string;
  date: number;
}) {
  return <UserAvatar src={avatarUrl} date={date} title={userName} />;
}
