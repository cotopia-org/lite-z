import CotopiaAvatar from "@/components/shared-ui/c-avatar";

type Props = {
  title: string;
  src?: string;
  className?: string;
  date?: number;
};

export default function Avatar({ title, src, date, className = "" }: Props) {
  return (
    <CotopiaAvatar date={date} className={className} src={src} title={title} />
  );
}
