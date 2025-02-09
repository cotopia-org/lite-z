import FullLoading from '@/components/shared/full-loading';
import { useApi } from '@/hooks/swr';
import { FetchDataType } from '@/services/axios';
import { WorkspaceType } from '@/types/workspace';
import React from 'react';
import { useParams } from 'react-router-dom';

export default function WorkspaceRootPage() {
  const params = useParams();
  const { data, isLoading } = useApi<FetchDataType<WorkspaceType>>(
    `/workspaces/${params.workspace_id}`,
  );

  const workspace = data !== undefined ? data?.data : null;

  if (data === undefined || isLoading) return <FullLoading />;

  if (workspace === null) return null;

  return (
    <div>
      <div className="relative p-8">
        <div className="flex flex-col gap-y-4">
          <h1 className="text-2xl font-bold">{workspace.title}</h1>
          <p>{workspace.description}</p>
        </div>
      </div>
    </div>
  );
}
