import { Coins, Grid, HandCoins, User, UserRoundPen, X } from 'lucide-react';
import CotopiaButton from '@/components/shared-ui/c-button';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  onClose?: () => void;
  links: {
    title: string;
    page: string;
    icon: ReactNode;
    content: ReactNode;
  }[];
  handleChange: (page: string) => void;
  page?: string;
};
export default function Sidebar({ onClose, links, handleChange, page }: Props) {
  return (
    <ul className="p-3  flex flex-col h-full w-1/5 gap-y-2 border-r  border-black/30">
      {links.map((link, index) => (
        <li key={index}>
          <CotopiaButton
            startIcon={link.icon}
            onClick={() => handleChange(link.page)}
            className={cn(
              'w-full justify-start text-base',
              link.page === page ? 'bg-primary text-white' : 'hover:bg-black/5',
            )}
            variant={'ghost'}
          >
            {link.title}
          </CotopiaButton>
        </li>
      ))}
      <li>
        <div className={'w-full border-t border-black/20 my-2'}></div>
        <CotopiaButton
          startIcon={<X size={16} />}
          onClick={onClose}
          className="w-full justify-start text-base hover:bg-primary hover:text-white"
          variant={'ghost'}
        >
          Close
        </CotopiaButton>
      </li>
    </ul>
  );
}
