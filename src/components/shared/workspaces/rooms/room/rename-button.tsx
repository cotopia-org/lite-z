import { EditIcon } from '@/components/icons';
import CotopiaButton from '@/components/shared-ui/c-button';
import { ButtonProps } from '@/components/ui/button';

type Props = {} & ButtonProps;

const RenameButton = (props: Props) => {
  return (
    <CotopiaButton
      variant={'ghost'}
      startIcon={<EditIcon size={18} />}
      className="text-sm"
      {...props}
    >
      Rename
    </CotopiaButton>
  );
};

export default RenameButton;
