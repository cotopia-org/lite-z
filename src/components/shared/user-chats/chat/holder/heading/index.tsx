import BackHolder from "../back";
import ChatDetails from "../../details";
import { Skeleton } from "@radix-ui/themes";
import Loading from "./loading";

type Props = {
  title: string;
  onBack: () => void;
  loading: boolean;
  type: string;
  muted: number;
};

export default function ChatHeading({
  title,
  onBack,
  loading,
  type,
  muted,
}: Props) {
  return (
    <div className="flex flex-row items-center gap-x-2 py-2 px-4 relative">
      <BackHolder onClick={onBack} />
      <ChatDetails muted={muted} title={title} type={type} />
      {!!loading && (
        <div className="absolute bottom-0 left-0 w-full z-10">
          <Loading />
        </div>
      )}
    </div>
  );
}
