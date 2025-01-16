import TalkItemDetails from './details';
import TalkItemTime from './time';

export default function TalkItemHeader() {
  return (
    <div className="flex flex-row items-center justify-between gap-x-10">
      <TalkItemDetails />
      <TalkItemTime />
    </div>
  );
}
