'use client';

import FullLoading from '@/components/shared/full-loading';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/components/ui/table';
import { ReactNode, useCallback, useEffect, useState } from 'react';

export type TableItems = {
  title?: string;
  align?: any;
  colSpan?: number;
  className?: string;
  render(item: any, row: any): ReactNode | string | number;
};

type Props = {
  tableHeadItems: TableItems[];
  items: any[];
  loading?: boolean;
  isSelectable?: boolean;
  defaultSelectedIds?: number[];
  notFoundMessage?: string | ReactNode;
  onSelectIds?: (selectedIds: number[]) => void;
  onSelectAllIds?: (selectedIds: number[]) => void;
  onDeSelectAllIds?: (selectedIds: number[]) => void;
};

const CotopiaTable = ({
  tableHeadItems = [],
  items,
  loading = false,
  isSelectable = false,
  defaultSelectedIds,
  notFoundMessage = 'There is no items!',
  onSelectIds,
  onSelectAllIds,
  onDeSelectAllIds,
}: Props) => {
  const [isSelectAll, setIsSelectAll] = useState(false);

  const [selectableIds, setSelectableIds] = useState<number[]>([]);

  useEffect(() => {
    if (defaultSelectedIds !== undefined) setSelectableIds(defaultSelectedIds);
  }, [defaultSelectedIds]);
  const toggleSelectItem = useCallback(
    (id: number) => {
      // Existing scenario
      if (!selectableIds.includes(id)) {
        setSelectableIds((crt) => {
          const nVal = [...crt, id];
          //When all items has been selected we should trigger the onSelectAllIds
          if (nVal?.length === items?.length && onSelectAllIds)
            onSelectAllIds(nVal);
          if (onSelectIds) onSelectIds(nVal);
          return nVal;
        });
      } else {
        setSelectableIds((crt) => {
          const nVal = crt.filter((item) => item !== id);
          if (onSelectIds) onSelectIds(nVal);
          return nVal;
        });
      }
    },
    [selectableIds, onSelectIds],
  );

  const selectAllHandler = useCallback(() => {
    if (!isSelectAll) {
      if (items?.length === 0) return;
      const allIds = items.map((item) => item?.id);
      setSelectableIds(allIds);
      if (onSelectIds) onSelectIds(allIds);
      setIsSelectAll(true);
      //Triggered when all items has been selected
      if (onSelectAllIds) onSelectAllIds(allIds);
    } else {
      setIsSelectAll(false);
      setSelectableIds([]);
      if (onSelectIds) onSelectIds([]);
      //Triggered when all items has been deselected
      if (onDeSelectAllIds) onDeSelectAllIds([]);
    }
  }, [items, isSelectAll, onSelectIds, onSelectAllIds, onDeSelectAllIds]);

  let content = (
    <>
      {items?.map((item: any, rowKey: any) => {
        const itemIsChecked = selectableIds.includes(item?.id);

        return (
          <TableRow key={rowKey}>
            {item?.id && isSelectable && (
              <TableCell>
                <Checkbox
                  className="justify-center"
                  onSelect={() => toggleSelectItem(item?.id)}
                  checked={itemIsChecked}
                />
              </TableCell>
            )}
            {tableHeadItems?.map((tdItem, tdKey) => (
              <TableCell
                className={`${tdItem?.className}`}
                key={tdKey}
                colSpan={tdItem.colSpan}
                align={tdItem.align || 'left'}
              >
                {tdItem.render(item, rowKey)}
              </TableCell>
            ))}
          </TableRow>
        );
      })}
    </>
  );

  if (items?.length === 0)
    content = (
      <TableRow>
        <TableCell colSpan={tableHeadItems?.length} className="text-center">
          <span>{notFoundMessage}</span>
        </TableCell>
      </TableRow>
    );

  if (loading)
    content = (
      <TableRow>
        <TableCell colSpan={tableHeadItems?.length} className="text-center">
          <FullLoading />
        </TableCell>
      </TableRow>
    );

  return (
    <Table>
      <TableRow className="w-full">
        {!!isSelectable && (
          <TableHead align="left">
            <Checkbox
              onSelect={selectAllHandler}
              checked={isSelectAll}
              className="justify-center"
            />
          </TableHead>
        )}
        {tableHeadItems?.map((item, key) => {
          return (
            <TableHead
              key={key}
              className="font-normal text-base text-black/[.87] text-left"
            >
              {item.title}
            </TableHead>
          );
        })}
      </TableRow>
      <TableBody>{content}</TableBody>
    </Table>
  );
};

export default CotopiaTable;
