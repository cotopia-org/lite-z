import { useApi } from "@/hooks/swr";
import { UserMinimalType } from "@/types/user";
import UserList from "./list";
import { ReactNode, useEffect, useState } from "react";
import CotopiaInput from "@/components/shared-ui/c-input";
import FullLoading from "../full-loading";
import { FetchDataType } from "@/services/axios";

type Props = {
  onPick?: (item: UserMinimalType) => void;
  afterTitle?: ReactNode;
  defaultSelectedId?: number;
  label?: boolean;
};

export default function UserSelector({
  onPick,
  afterTitle,
  defaultSelectedId,
  label,
}: Props) {
  const [selected, setSelected] = useState<UserMinimalType | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (defaultSelectedId === undefined) setSelected(null);
  }, [defaultSelectedId]);

  const { data, isLoading } = useApi<FetchDataType<UserMinimalType[]>>(
    `/users/search`,
    {
      method: "POST",
      data: {
        search,
      },
      key: `/users/search/${search}`,
      isFetch: search !== "",
    }
  );

  const items = data?.data || [];

  const handlePick = (item: UserMinimalType) => {
    setSearch("");
    setSelected(item);
    if (onPick) onPick(item);
  };

  let content = null;

  if (items.length > 0)
    content = (
      <UserList
        items={items}
        onPick={handlePick}
        defaultSelectedId={defaultSelectedId}
      />
    );

  if (items.length === 0 && data !== undefined)
    content = (
      <strong className='p-4 shadow-md rounded-lg text-sm'>{`Could not find a Cotopia account ${
        search ? `matching "${search}"` : ""
      }`}</strong>
    );

  if (isLoading) content = <FullLoading />;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (selected) setSelected(null);
  };

  return (
    <div className='flex flex-col gap-y-4'>
      {label && (
        <p className='text-black/60'>Search by username, full name, or email</p>
      )}

      {!!afterTitle && afterTitle}

      <CotopiaInput
        label={!label ? "Select User" : ""}
        placeholder={selected ? "Selected user" : "Find people"}
        value={selected ? selected.name : search}
        onChange={handleChange}
      />

      {content}
    </div>
  );
}
