import Talks from './talks';
import TalkDidntRespondBox from './talks/didnt-respond';

export default function Notifications() {
  return (
    <div className="flex flex-col gap-y-4 absolute top-[64px] right-0 w-auto">
      <Talks />
      {/* <TalkDidntRespondBox /> */}
    </div>
  );
}
