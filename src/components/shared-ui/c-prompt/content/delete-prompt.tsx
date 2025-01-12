import CotopiaPromptContent, { CotopiaPromptType } from '.';

type Props = {} & CotopiaPromptType;

const DeletePrompt = ({ submitText = 'Delete', ...props }: Props) => {
  return (
    <CotopiaPromptContent
      className="[&_.prompt-title]:text-error"
      submitText={submitText}
      submitVariant={'destructive'}
      {...props}
    />
  );
};

export default DeletePrompt;
