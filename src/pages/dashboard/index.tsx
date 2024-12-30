import { ScrollArea } from '@/components/ui/scroll-area';
import { ReactNode, useState } from 'react';
import Sidebar from '@/pages/dashboard/sidebar';
import useAuth from '@/hooks/auth';
import { useRoomContext } from '@/components/shared/room/room-context';
import { isUserAdmin } from '@/lib/utils';
import Jobs from '@/pages/dashboard/jobs';
import { Briefcase, LayoutDashboard, Users as UsersIcon } from 'lucide-react';
import Users from '@/pages/dashboard/users';

interface Props {
  children?: ReactNode;
  onClose: () => void;
  defaultPage?: string;
}

function DashboardPage() {
  return <div>Dashboard</div>;
}

export default function Dashboard({
  children,
  onClose,
  defaultPage = 'dashboard',
}: Props) {
  const links: {
    title: string;
    page: string;
    icon: ReactNode;
    content: ReactNode;
  }[] = [
    {
      title: 'Dashboard',
      page: 'dashboard',
      content: <DashboardPage />,
      icon: <LayoutDashboard size={16} />,
    },
    {
      title: 'Users',
      page: 'users',
      content: <Users />,
      icon: <UsersIcon size={16} />,
    },
    {
      title: 'Jobs',
      page: 'jobs',
      content: <Jobs />,
      icon: <Briefcase size={16} />,
    },
  ];

  const { user } = useAuth();
  const { workspace_id } = useRoomContext();
  const [page, setPage] = useState(defaultPage);

  const handleChange = (page: string) => {
    setPage(page);
  };

  // const isAdmin = isUserAdmin(user, workspace_id ? +workspace_id : undefined);

  return (
    <main className="w-full min-h-full  flex gap-x-2">
      <Sidebar
        links={links}
        handleChange={handleChange}
        onClose={onClose}
        page={page}
      />
      <ScrollArea className="h-screen flex flex-col gap-y-4 w-full py-3">
        {children ?? links.find((link) => link.page === page)?.content}
      </ScrollArea>
    </main>
  );
}
