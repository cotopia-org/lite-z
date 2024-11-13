import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CotopiaInput from "@/components/shared-ui/c-input";

import CopyBtn from "@/components/shared/copy-btn";
import { VARZ } from "@/const/varz";

type Props = {
  code: string;
  onCopy: () => void;
  onCancel: () => void;
};
export function CodePicker({ code, onCopy, onCancel }: Props) {
  const finalCopyUrl = `${VARZ.domain}/invite/${code}`;

  return (
    <Dialog open>
      <DialogContent className='sm:max-w-md [&_.opacity-70]:!hidden'>
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be join to this room.
          </DialogDescription>
        </DialogHeader>
        <div className='flex items-center space-x-2'>
          <CotopiaInput defaultValue={finalCopyUrl} readOnly />
          <CopyBtn code={finalCopyUrl} />
        </div>
        <DialogFooter className='sm:justify-start'>
          <DialogClose asChild onClick={onCancel}>
            <Button type='button' variant='secondary'>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
