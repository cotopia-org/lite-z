import CotopiaButton from '@/components/shared-ui/c-button'
import React from 'react'

export default function UploadActions() {
  return (
    <div className='flex flex-row justify-between'>
        <CotopiaButton variant={'ghost'}>Cancel</CotopiaButton>
        <CotopiaButton variant={'ghost'}>Send</CotopiaButton>
    </div>
  )
}
