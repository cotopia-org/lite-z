import { ReactNode, useEffect, useRef, useState } from "react";
import { OrgIconButton, OrgInput } from "../../shared-ui";
import { OrgInputProps } from "../../shared-ui/o-input";
import OPopover from "../../shared-ui/o-popover";
import List from "./list";
import { useApi } from "@/hooks/use-api";
import { cn, urlWithQueryParams } from "@/lib/utils";
import CircularLoading from "@/components/partials/circular-loading";
import { X } from "lucide-react";

type Props<T> = {
  endpoint: string;
  render: (item: T, handleSelect: () => void) => ReactNode;
  keyToSearch: string;
} & OrgInputProps;
export default function AutocompleteInput<T>({
  endpoint,
  render,
  keyToSearch,
  ...rest
}: Props<T>) {
  const listRef = useRef<HTMLDivElement>(null);

  const [inputWidth, setInputWidth] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState<string>();

  const handleSelect = () => {
    setValue("");
    setIsOpen(false);
  };

  const { data, isLoading } = useApi<T[]>(
    urlWithQueryParams(endpoint, { [keyToSearch]: value })
  );

  const items = data !== undefined ? data : [];

  return (
    <>
      <OPopover
        open
        trigger={
          <div className='w-full relative'>
            <OrgInput
              {...rest}
              value={value}
              onChange={(e) => {
                const value = e.target.value;
                setValue(value);

                if (value && !isOpen) setIsOpen(true);
              }}
              onClick={() => {
                setIsOpen((prev) => !prev);
              }}
              onGetCoords={(coords) => setInputWidth(coords.width)}
              autoFocus
            />
            {isOpen && (
              <OrgIconButton
                onClick={() => setIsOpen(false)}
                className='absolute top-11 left-2'
              >
                <X />
              </OrgIconButton>
            )}
          </div>
        }
        contentClassName={cn("p-0", !!!isOpen ? "hidden" : "border-0")}
        contentWidth={inputWidth}
      >
        {!!isOpen && (
          <div ref={listRef}>
            {isLoading || data === undefined ? (
              <CircularLoading className='py-4' />
            ) : (
              <List<T> items={items} render={(x) => render(x, handleSelect)} />
            )}
          </div>
        )}
      </OPopover>
    </>
  );
}
