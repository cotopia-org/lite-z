import { ScrollArea } from "@/components/ui/scroll-area";
import { ReactNode, useState } from "react";
import Sidebar from "@/pages/dashboard/sidebar";
import useAuth from "@/hooks/auth";
import { useRoomContext } from "@/components/shared/room/room-context";
import { isUserAdmin } from "@/lib/utils";
import Jobs from "@/pages/dashboard/jobs";
import { LayoutDashboard } from "lucide-react";
import { BriefcaseIcon } from "@/components/icons";

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
  defaultPage = "dashboard",
}: Props) {
  const links: {
    title: string;
    page: string;
    icon: ReactNode;
    content: ReactNode;
  }[] = [
    {
      title: "Dashboard",
      page: "dashboard",
      content: <DashboardPage />,
      icon: <LayoutDashboard />,
    },
    {
      title: "Jobs",
      page: "jobs",
      content: <Jobs />,
      icon: <BriefcaseIcon />,
    },
  ];

  const { user } = useAuth();
  const { workspace_id } = useRoomContext();
  const [page, setPage] = useState(defaultPage);

  const handleChange = (page: string) => {
    setPage(page);
  };

  const isAdmin = isUserAdmin(user, workspace_id ? +workspace_id : undefined);

  console.log(page);

  return (
    <main className="w-full min-h-screen flex gap-x-2">
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
