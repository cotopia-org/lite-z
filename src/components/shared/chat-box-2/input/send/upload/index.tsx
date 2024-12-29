
import { Paperclip} from 'lucide-react'
import { createContext, useCallback, useContext, useState } from 'react'
import UploadButton from './upload-button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import UploadRenderer from './types/renderer'
import UploadActions from './actions'


const UploadAttachmentContext = createContext<{file: File | undefined, closeModal: () => void}>({file: undefined, closeModal: () => {}})

export const useUploadAttachment = () => useContext(UploadAttachmentContext)

export default function UploadAttachment() {

  const [file, setFile] = useState<File | undefined>(undefined)

  const handleFile = useCallback((file: File | null) => {

    if (file === null) return

    setFile(file)
  }, [])

  const closeModal = () => {
    setFile(undefined)
  }
 
  return (
    <UploadAttachmentContext.Provider value={{file, closeModal}}> 
        <UploadButton icon={<Paperclip />} onSelect={handleFile}  />
        <Dialog open={!!file} onOpenChange={(open) => open === false && setFile(undefined)}>      
          <DialogContent>
          {!!file && <UploadRenderer file={file} />}
          <UploadActions />
        </DialogContent>
      </Dialog>
    </UploadAttachmentContext.Provider>
  )
}
