import { WorkspaceType } from '@/types/workspace';
import WorkspaceItem from './workpsace/workspace';
import NotFound from '../layouts/not-found';
import { Route } from 'lucide-react';
import JoinWorkspaceWithLink from '@/pages/home/components/join-with-link';

type Props = {
  items: WorkspaceType[];
};
export default function Workspaces({ items }: Props) {
  //Return nothing when items is empty
  if (items.length === 0)
    return (
      <div>
        <NotFound
          className="py-6"
          icon={<Route className="text-black/60" />}
          title="There is no workspace here!"
        />
      </div>
    );

  return (
    <div className="flex flex-col gap-y-2">
      {items.map((workspace) => (
        <WorkspaceItem item={workspace} key={workspace.id} />
      ))}
    </div>
  );
}
