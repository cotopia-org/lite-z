import CotopiaInput from "@/components/shared-ui/c-input";
import { User, Tag, X } from "lucide-react";
import StatusBox from "../status-box";
import { useEffect, useState } from "react";
import axiosInstance from "@/services/axios";
import { urlWithQueryParams } from "@/lib/utils";
import { JobType } from "@/types/job";
import { useApi } from "@/hooks/swr";
import CotopiaMention from "@/components/shared-ui/c-mention";
import { MentionType } from "@/types/mention";

export type SearchType = {
  model_id: number;
  title: string;
  type: string;
};

export default function Search({
  onChange,
  onSelect,
  defaultSelected = [],
}: {
  onChange: (values: SearchType[]) => void;
  onSelect?: (value: SearchType) => void;
  defaultSelected?: SearchType[] | MentionType[];
}) {
  const [q, setQ] = useState<string>("");
  const [selected, setSelected] = useState<SearchType[] | MentionType[]>(
    defaultSelected,
  );

  const handleRemoveSelect = (item: SearchType | MentionType) => {
    const data = selected.filter((s) => {
      if (s.type === item.type) {
        return item.model_id !== s.model_id;
      } else {
        return s;
      }
    });
    setSelected(data);
    onChange(data);
  };

  const handleAddSelect = (item: SearchType | MentionType) => {
    const data = [
      ...selected.filter((s) => {
        if (s.type === item.type) {
          return item.model_id !== s.model_id;
        } else {
          return s;
        }
      }),
      item,
    ];

    setSelected(data);
    onChange(data);
    if (onSelect) {
      onSelect(item);
    }
  };
  const { data, isLoading } = useApi("/search?q=" + q, {
    isFetch: q.length >= 3,
  });

  const result: SearchType[] = data !== undefined ? data?.data : [];
  return (
    <div className={"w-full flex flex-col gap-y-2 relative"}>
      {q.length >= 3 && (
        <div
          className={
            "border border-black rounded flex w-full   p-1 flex-col divide-y gap-y-2 absolute bottom-20 z-20 bg-white"
          }
        >
          {result.map((item) => {
            return (
              <CotopiaMention
                item={item}
                onClick={() => {
                  handleAddSelect(item);
                  setQ("");
                }}
              />
            );
          })}

          {isLoading && <div className={"text-center"}>Loading...</div>}
          {result.length < 1 && !isLoading && (
            <span className={"text-xs text-slate-400 text-center"}>
              Sorry, No result 😞
            </span>
          )}
        </div>
      )}

      <div>
        <CotopiaInput
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
          }}
          placeholder="Search..."
        />
      </div>
      {selected.length > 0 && (
        <div className={"flex flex-wrap gap-1 "}>
          {selected.map((item) => {
            return (
              <StatusBox
                label={
                  <div className={"flex flex-row gap-x-1 items-center"}>
                    <span>{item.title}</span>

                    <X
                      onClick={() => {
                        handleRemoveSelect(item);
                      }}
                      color={"red"}
                      size={10}
                    />
                  </div>
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
