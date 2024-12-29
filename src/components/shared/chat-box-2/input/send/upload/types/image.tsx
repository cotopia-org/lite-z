import { DialogClose, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { X } from 'lucide-react'
import { useUploadAttachment } from '..'

export default function UploadImage() {

  const {file} =  useUploadAttachment()

  if (!file) return null

  return (
    <>
        <DialogHeader className="dialog-header flex-row justify-between w-full  items-center">
            <DialogTitle className="dialog-title text-3xl font-medium">
                {`Send an image`}
            </DialogTitle>
            <DialogClose className="opacity-70 hover:opacity-100">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
            </DialogClose>
        </DialogHeader>
        <div className='bg-black/10'>
            <img src={URL.createObjectURL(file)} className='max-h-[300px] mx-auto' />
        </div>
    </>
  )
}
