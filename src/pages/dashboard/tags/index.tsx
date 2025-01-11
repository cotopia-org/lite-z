import CotopiaButton from '@/components/shared-ui/c-button';
import CotopiaTable from '@/components/shared-ui/c-table';
import ParticipantsWithPopover from '@/components/shared/participants/with-popover';
import { useRoomContext } from '@/components/shared/room/room-context';
import { useApi } from '@/hooks/swr';
import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { TagType } from '@/types/tag';
import Tag from './single';
import { useDashboard } from '@/pages/dashboard';
import axiosInstance from '@/services/axios';
import { toast } from 'sonner';
import CreateTag from '@/pages/dashboard/tags/create';

type Props = {
  isAll?: boolean;
};

export default function Tags({ isAll = true }: Props) {
  const { workspace_id } = useRoomContext();
  const [creating, setCreating] = useState<boolean>(false);

  const { selectItem, item, editItem } = useDashboard();

  const { data, isLoading, mutate } = useApi(
    `/workspaces/${workspace_id}/tags`,
  );
  const tags: TagType[] = data !== undefined ? data?.data : [];

  let finalTags = tags;

  const tableHeadItems = useMemo(() => {
    const items = [
      {
        title: '#',
        render: (item: TagType) => {
          return item.id;
        },
      },
      {
        title: 'Title',
        render: (item: TagType) => {
          return (
            <CotopiaButton
              variant={'link'}
              onClick={() => selectItem(item, 'tag')}
            >
              {item.title}
            </CotopiaButton>
          );
        },
      },
      {
        title: 'Members',
        render: (item: TagType) => {
          return (
            <ParticipantsWithPopover
              className="!pb-0"
              participants={item.members}
            />
          );
        },
      },
      {
        title: '',
        render: (item: TagType) => {
          return (
            <div className={'flex gap-2'}>
              <CotopiaButton
                className={'text-white'}
                variant={'destructive'}
                onClick={() => handleRemoveTag(item.id)}
              >
                Delete
              </CotopiaButton>
            </div>
          );
        },
      },
    ];

    return items;
  }, [isAll]);

  const handleRemoveTag = async (tag_id: number) => {
    await axiosInstance({
      url: '/tags/' + tag_id,
      method: 'DELETE',
    });
    toast.success('Tag has been deleted!');
    await mutate();
  };

  if (creating) {
    return (
      <CreateTag
        onBack={() => {
          setCreating(false);
          mutate();
        }}
        workspace_id={workspace_id}
      />
    );
  }

  if (item && item.type === 'tag')
    return (
      <Tag
        onBack={() => {
          selectItem(undefined);
        }}
        tag={item.data}
        mutate={mutate}
      />
    );

  return (
    <div className={'p-4'}>
      <div className="flex flex-row items-center gap-x-4 justify-between">
        <h1 className={'text-lg font-bold'}>Tags</h1>
        <CotopiaButton
          variant={'default'}
          startIcon={<Plus />}
          onClick={() => {
            setCreating(true);
          }}
        >
          New Tag
        </CotopiaButton>
      </div>

      <CotopiaTable
        loading={isLoading}
        items={finalTags}
        tableHeadItems={tableHeadItems}
      />
    </div>
  );
}
