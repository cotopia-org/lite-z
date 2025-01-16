import Reject from './reject';
import Accept from './accept';
import { TalkType } from '@/types/talk';

type Props = {
  onAccept: (talk: TalkType) => void;
  onReject: (talk: TalkType) => void;
};

export default function TalkItemActions({ onAccept, onReject }: Props) {
  return (
    <div className="flex flex-row justify-end gap-x-2">
      <Reject onReject={onReject} />
      <Accept onAccept={onAccept} />
    </div>
  );
}
