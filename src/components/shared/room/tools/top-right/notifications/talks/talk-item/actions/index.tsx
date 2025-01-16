import Reject from './reject';
import Accept from './accept';

export default function TalkItemActions() {
  return (
    <div className="flex flex-row justify-end gap-x-2">
      <Reject />
      <Accept />
    </div>
  );
}
