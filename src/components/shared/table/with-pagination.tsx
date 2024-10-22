import CircularLoading from "@/components/partials/circular-loading";
import { useApi } from "@/hooks/use-api";
import { urlWithQueryParams } from "@/lib/utils";
import { FetchPaginatedDataType } from "@/services/axios";
import { getItemsFromPagination } from "@/utils/utils";
import { Table, TableProps } from ".";
import ErrorElement from "@/components/partials/error-boundry";
import NotFound from "@/components/partials/not-found";
import OrgPagination from "@/components/shared-ui/o-pagination";
import { useLocation, useNavigate } from "react-router-dom";
import useQuery from "@/hooks/query-params";
import useBus, { dispatch } from "use-bus";
import { __BUS } from "@/const/bus";

type Props<T> = {
  endpoint: string;
  defaultQueries?: { [key: string]: any };
  notFoundText?: string;
} & Omit<TableProps<T>, "items">;

export default function TableWithPagination<T extends {}>({
  columns,
  endpoint,
  defaultQueries,
  notFoundText,
  ...rest
}: Props<T>) {
  const navigate = useNavigate();
  const location = useLocation();
  const { query } = useQuery();

  const page = query?.page ?? 1;

  const { data, isLoading, error, mutate } = useApi<FetchPaginatedDataType<T>>(
    urlWithQueryParams(endpoint, { ...defaultQueries, page })
  );

  //Mutate again whenever this bus event triggered
  useBus(__BUS.mutateTableAgain, () => {
    mutate();
  });

  const items = getItemsFromPagination(data);
  const paginatedDateMeta = data !== undefined ? data?._meta : undefined;

  const handleChangePage = (page: number) => {
    navigate(urlWithQueryParams(location.pathname, { ...query, page }));
  };

  if (isLoading || data === undefined) return <CircularLoading />;

  if (items.length === 0) return <NotFound text={notFoundText} />;

  if (error) return <ErrorElement />;

  return (
    <div className='flex flex-col gap-y-8 w-full'>
      <Table<T>
        items={items}
        columns={columns}
        className='gap-y-4'
        rowClassName='rounded-lg shadow-md'
        {...rest}
      />
      <OrgPagination
        currentPage={paginatedDateMeta?.currentPage ?? 0}
        onPageChange={handleChangePage}
        totalItems={paginatedDateMeta?.totalCount ?? 0}
        perPage={paginatedDateMeta?.perPage ?? 0}
      />
    </div>
  );
}
