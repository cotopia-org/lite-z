import { ScrollArea } from '@/components/ui/scroll-area';
import { createContext, ReactNode, useContext, useState } from 'react';
import Sidebar from '@/pages/dashboard/sidebar';
import Jobs from '@/pages/dashboard/jobs';
import {
  Briefcase,
  LayoutDashboard,
  Tag as TagIcon,
  Users as UsersIcon,
} from 'lucide-react';
import Users from '@/pages/dashboard/users';
import Tags from './tags';
import { JobType } from '@/types/job';
import { TagType } from '@/types/tag';
import { UserType } from '@/types/user';
import Tag from '@/pages/dashboard/tags/single';
import Job from '@/pages/dashboard/jobs/single';
import User from '@/pages/dashboard/users/single';

interface Props {
  children?: ReactNode;
  onClose: () => void;
  defaultPage?: PageType;
}

function DashboardPage() {
  return <div>Dashboard</div>;
}

type DashboardType = {
  changePage: (page: PageType) => void;

  page: PageType;

  selectItem: (item: any, type?: string) => void;
  item: any;

  editItem: (item: any, type?: string) => void;
};

export type PageType = 'dashboard' | 'users' | 'jobs' | 'tags';

const DashboardContext = createContext<DashboardType>({
  changePage: (page?: PageType) => {},
  page: 'dashboard',
  selectItem: (item: any, type?: string) => {},
  item: undefined,
  editItem: (item: any, type?: string) => {},
});

export const useDashboard = () => useContext(DashboardContext);

export default function Dashboard({
  children,
  onClose,
  defaultPage = 'dashboard',
}: Props) {
  const links: {
    title: string;
    page: PageType;
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
    {
      title: 'Tags',
      page: 'tags',
      content: <Tags />,
      icon: <TagIcon size={16} />,
    },
  ];

  const [page, setPage] = useState<PageType>(defaultPage);

  const handleChange = (page: PageType) => {
    setPage(page);
    setSelectedItem(undefined);
  };

  const [selectedItem, setSelectedItem] = useState<{
    data: any;
    type?: string;
    edit: boolean;
  }>();

  const selectItem = (item: any, type?: string) => {
    setSelectedItem({
      data: item,
      type,
      edit: false,
    });
  };

  const editItem = (item: any, type?: string) => {
    setSelectedItem({
      data: item,
      type,
      edit: true,
    });
  };

  let content = children ?? links.find((link) => link.page === page)?.content;

  return (
    <DashboardContext.Provider
      value={{
        changePage: handleChange,
        page,
        item: selectedItem,
        selectItem,
        editItem,
      }}
    >
      <main className="w-full min-h-full  flex gap-x-2">
        <Sidebar
          links={links}
          handleChange={handleChange}
          onClose={onClose}
          page={page}
        />
        <ScrollArea className="h-screen flex flex-col gap-y-4 w-full py-3">
          {content}
        </ScrollArea>
      </main>
    </DashboardContext.Provider>
  );
}
