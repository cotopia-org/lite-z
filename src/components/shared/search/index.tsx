import CotopiaInput from "@/components/shared-ui/c-input";
import { User, Tag, X } from "lucide-react";
import StatusBox from "../status-box";

type SearchType = {
  id: number;
  title: string;
  type: string;
};

export default function Search({
  q,
  result,
  setQ,
  selected,
  handleAddSelect,
  handleRemoveSelect,
}: {
  selected: SearchType[];
  handleAddSelect: (item: SearchType) => void;
  handleRemoveSelect: (item: SearchType) => void;
  q: string;
  setQ: (q: string) => void;
  result: SearchType[];
}) {
  return (
    <div className={"w-full flex flex-col gap-y-2"}>
      {q.length >= 3 && (
        <div
          className={
            "border border-black rounded flex   p-1 flex-col divide-y gap-y-2"
          }
        >
          {result.map((item) => {
            return (
              <div
                onClick={() => {
                  handleAddSelect(item);
                  setQ("");
                }}
                className={
                  "flex flex-row items-center gap-x-1 justify-center hover:bg-slate-300 hover:cursor-pointer"
                }
              >
                {item.type === "user" ? <User size={16} /> : <Tag size={16} />}
                <span>{item.title}</span>
              </div>
            );
          })}

          {result.length < 1 && (
            <span className={"text-xs text-slate-400 text-center"}>
              Sorry, No result 😞
            </span>
          )}
        </div>
      )}

      {selected.length > 0 && (
        <div className={"flex flex-row gap-x-1"}>
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

      <div>
        <CotopiaInput
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
          }}
          placeholder="Search..."
        />
      </div>
    </div>
  );
}
