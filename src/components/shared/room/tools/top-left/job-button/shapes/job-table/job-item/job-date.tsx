import StatusBox from "@/components/shared/status-box";
import moment from "moment";

type Props = {
  date: string;
};

export default function JobDate({ date }: Props) {
  return <StatusBox label={moment(date).fromNow()} variant='info' />;
}
