import { Chat2ItemType } from "@/types/chat2";
import { EditIcon, X } from "lucide-react";
import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import { useAppDispatch } from "@/store";
import { clearEditMessage } from "@/store/slices/chat-slice";

type Props = {
  item: Chat2ItemType;
};
export default function EditBox({ item }: Props) {
  const dispatch = useAppDispatch();
  const handleClearReaplyBox = () => dispatch(clearEditMessage(item.chat_id));

  return (
    <div className='flex flex-row items-center justify-between px-4 py-2 border-b'>
      <div className='flex flex-row items-center gap-x-4'>
        <div>
          <EditIcon className='text-primary' />
        </div>
        <div className='flex flex-col gap-y-1'>
          <strong className='text-primary'>{`Edit message`}</strong>
          <span className='whitespace-nowrap text-ellipsis overflow-hidden max-w-[200px]'>
            {item.text}
          </span>
        </div>
      </div>
      <div>
        <CotopiaIconButton
          className='opacity-50 hover:opacity-100 text-black'
          onClick={handleClearReaplyBox}
        >
          <X />
        </CotopiaIconButton>
      </div>
    </div>
  );
}
