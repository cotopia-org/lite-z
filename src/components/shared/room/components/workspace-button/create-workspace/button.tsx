'use client';

import CotopiaButton from '@/components/shared-ui/c-button';
import CreateWorkspace from '.';
import { Plus } from 'lucide-react';
import { FullModalBox } from '@/components/shared/modal-box';

export default function CreateWorkspaceButton({
  onUpdate,
}: {
  onUpdate?: () => {};
}) {
  return (
    <FullModalBox
      title="Create Workspace"
      trigger={(open) => (
        <CotopiaButton
          variant={'ghost'}
          startIcon={<Plus size={16} />}
          onClick={open}
          className="w-full justify-start"
        >
          Create workspace
        </CotopiaButton>
      )}
      className="w-[640px]"
    >
      {(open, close) => <CreateWorkspace onUpdate={onUpdate} onClose={close} />}
    </FullModalBox>
  );
}
