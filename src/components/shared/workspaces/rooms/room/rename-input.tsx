import { TickCircleIcon } from '@/components/icons';
import CotopiaIconButton from '@/components/shared-ui/c-icon-button';
import { colors } from '@/const/varz';
import { useLoading } from '@/hooks';
import { cn } from '@/lib/utils';
import axiosInstance from '@/services/axios';
import { WorkspaceRoomShortType } from '@/types/room';
import { X } from 'lucide-react';
import { FormEvent, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';

type Props = {
  room: WorkspaceRoomShortType;
  className?: string;
  onCancel: () => void;
  onSubmit?: () => void;
};

const RenameInput = ({ room, onCancel, onSubmit, className = '' }: Props) => {
  const { isLoading, startLoading, stopLoading } = useLoading();

  const inputRef = useRef<HTMLInputElement>(null);

  const defaultValue = room.title;

  useEffect(() => {
    if (inputRef?.current) {
      inputRef?.current.focus();
    }
  }, []);

  const submitFormHandler = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!inputRef?.current) return;
      const value = inputRef?.current?.value;
      if (!value) return;
      startLoading();
      try {
        await axiosInstance.put(`/rooms/${room.id}`, { title: value });
        toast.success('Room name has been updated successfully.');
        stopLoading();
        if (onSubmit) onSubmit();
        inputRef.current.value = '';
      } catch (error) {
        stopLoading();
      }
    },
    [onSubmit, room.id, startLoading, stopLoading],
  );

  return (
    <form
      className={cn(
        `flex border gap-x-1 rounded-xl 
      border-grayscale-border w-[calc(100%-16px)] bg-primary/[0.05] m-auto px-4 p-3`,
        className,
      )}
      onSubmit={submitFormHandler}
    >
      <input
        ref={inputRef}
        className="border-none outline-none w-full"
        defaultValue={defaultValue}
      />
      <div className="flex items-center gap-x-1">
        <CotopiaIconButton onClick={onCancel} className="w-6 h-6">
          <X size={18} color={colors.grayscale.subtitle} />
        </CotopiaIconButton>
        <CotopiaIconButton
          type="submit"
          loading={isLoading}
          className="w-6 h-6"
        >
          <TickCircleIcon size={20} color={colors.primary.default} />
        </CotopiaIconButton>
      </div>
    </form>
  );
};

export default RenameInput;
