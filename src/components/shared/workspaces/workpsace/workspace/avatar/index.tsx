import CotopiaAvatar from "@/components/shared-ui/c-avatar";

type Props = {
  title: string;
  date: number;
};
export default function WorkspaceAvatar({ title, date }: Props) {
  return (
    <CotopiaAvatar
      src=""
      date={date}
      title={title}
      className="w-[44px] h-[44px]"
    />
  );
}
