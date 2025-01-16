import { ReactNode } from 'react';
import CotopiaButton from '../../c-button';
import { buttonVariants } from '@/components/ui/button';
import { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export type CotopiaPromptType = {
  title: string;
  description?: ReactNode;
  onSubmit: () => void;
  onClose: () => void;
  submitVariant?: VariantProps<typeof buttonVariants>['variant'];
  cancelVariant?: VariantProps<typeof buttonVariants>['variant'];
  loading?: boolean;
  submitText?: string;
  cancelText?: string;
  afterDesc?: ReactNode;
  className?: string;
  hasNotAction?: boolean;
};
export default function CotopiaPromptContent({
  title,
  description,
  onClose,
  loading = false,
  onSubmit,
  submitText = 'Submit',
  cancelText = 'Close',
  submitVariant = 'default',
  cancelVariant = 'primary-outline',
  className = '',
  afterDesc,
  hasNotAction = false,
}: CotopiaPromptType) {
  let desc_node = description;

  if (typeof description === 'string') {
    desc_node = (
      <p className="prompt-desc font-medium text-base text-grayscale-subtitle">
        {description}
      </p>
    );
  }

  return (
    <div className={cn('flex flex-col gap-y-6', className)}>
      <div className="flex flex-col gap-y-2">
        <strong className="prompt-title font-medium text-xl">{title}</strong>
        {!!description && desc_node}
        {!!afterDesc && afterDesc}
      </div>
      {hasNotAction === false && (
        <div className="flex flex-row w-full items-center gap-x-2">
          <CotopiaButton
            onClick={onClose}
            className="!px-6 w-full "
            variant={cancelVariant}
          >
            {cancelText}
          </CotopiaButton>
          <CotopiaButton
            variant={submitVariant}
            loading={loading}
            onClick={onSubmit}
            className="!px-6 w-full"
          >
            {submitText}
          </CotopiaButton>
        </div>
      )}
    </div>
  );
}
