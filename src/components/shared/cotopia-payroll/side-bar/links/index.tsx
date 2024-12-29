import {
  CircleDollarSign,
  Coins,
  Grid,
  HandCoins,
  User,
  UserRoundPen,
  Users,
  X,
} from 'lucide-react';
import CotopiaButton from '@/components/shared-ui/c-button';
import { PayrollPage, usePayroll } from '@/pages/cotopia-payroll/user/payroll';
import { ReactNode } from 'react';
import { cn, isUserAdmin } from '@/lib/utils';
import useAuth from '@/hooks/auth';
import { useRoomContext } from '@/components/shared/room/room-context';

export default function PayrollSideBarLink() {
  const { onClose, changePage, page } = usePayroll();
  const { user } = useAuth();
  const { workspace_id } = useRoomContext();

  const isAdmin = isUserAdmin(user, workspace_id ? +workspace_id : undefined);

  const links: {
    title: string;
    page: PayrollPage;
    icon: ReactNode;
  }[] = isAdmin
    ? [
        {
          title: 'All Contracts',
          page: 'all-user-contract',
          icon: <User />,
        },
        {
          title: 'All Payments',
          page: 'all-payments',
          icon: <Coins />,
        },

        // {
        //   title: "Members",
        //   page: "all-members",
        //   icon: <Users />,
        // },
        // {
        //   title: "Users Payments",
        //   page: "all-payment",
        //   icon: <CircleDollarSign />,
        // },
        {
          title: 'Create Contract',
          page: 'create-contract',
          icon: <UserRoundPen />,
        },
        {
          title: 'Create Payments',
          page: 'create-payments',
          icon: <HandCoins />,
        },

        {
          title: 'My contracts',
          page: 'user-contract',
          icon: <User />,
        },
        {
          title: 'My Payments',
          page: 'payments',
          icon: <Coins />,
        },
      ]
    : [
        {
          title: 'My contracts',
          page: 'user-contract',
          icon: <User />,
        },
        {
          title: 'All Payments',
          page: 'all-payments',
          icon: <Grid />,
        },
        {
          title: 'Users Payments',
          page: 'all-payment',
          icon: <Grid />,
        },
        {
          title: 'My Payments',
          page: 'payments',
          icon: <Coins />,
        },
      ];

  return (
    <ul className="p-3 mt-4 flex flex-col gap-y-2">
      {links.map((link) => (
        <li key={link.title}>
          <CotopiaButton
            startIcon={link.icon}
            onClick={() => changePage(link.page)}
            className={cn(
              'w-full justify-start text-lg',
              link.page === page ? 'bg-primary text-white' : 'hover:bg-black/5',
            )}
            variant={'ghost'}
          >
            {link.title}
          </CotopiaButton>
        </li>
      ))}
      <li>
        <CotopiaButton
          startIcon={<X />}
          onClick={onClose}
          className="w-full justify-start text-lg hover:bg-primary hover:text-white"
          variant={'ghost'}
        >
          Close
        </CotopiaButton>
      </li>
    </ul>
  );
}
