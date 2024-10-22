import { ReactNode, useRef, useState } from "react";

import { Menu, X } from "lucide-react";
import { OrgIconButton } from "@/components/shared-ui";
import useBus from "use-bus";
import { __BUS } from "@/const/bus";
import Logo from "@/components/partials/logo";
import { cn } from "@/lib/utils";

const ZEMTRIX_LINK = `https://zemtrix.com`;

interface Props {
  children: ({ expanded }: { expanded: boolean }) => ReactNode;
}

const ExpandableMenu = ({ children }: Props) => {
  const [expand, setExpand] = useState(false);

  useBus(__BUS.openMainSideBar, () => {
    toggleMenuHandler();
  });

  useBus(__BUS.closeMainSideBar, () => {
    toggleMenuHandler();
  });

  const toggledRef = useRef(false);

  let clss = `flex flex-col transition-all duration-300 gap-y-8 min-w-[80px] py-4 h-full max-h-screen ${
    expand
      ? "!min-w-[300px] !animate-expand !items-start"
      : !expand && toggledRef.current
      ? "w-[80px] animate-collapse"
      : ""
  } `;

  if (!expand) clss += " !items-center";

  const toggleMenuHandler = () => {
    setExpand((crt) => {
      if (!toggledRef.current) toggledRef.current = true;
      return !crt;
    });
  };

  const zemtrixLogo = <img src='/zemtrix.svg' alt='Zemtrix Logo' />;

  return (
    <div
      className={cn(
        `bg-white shadow-app-bar`,
        expand
          ? "md:flex fixed md:relative top-0 md:top-[initial] left-0 md:left-[initial] w-screen md:w-auto h-screen md:h-auto z-[10]"
          : "hidden md:flex"
      )}
    >
      <div className={clss}>
        <div className={`${expand ? "px-4" : ""}`}>
          <OrgIconButton
            className='!min-w-10 !min-h-10'
            onClick={toggleMenuHandler}
            type='button'
          >
            {expand ? <X size={32} /> : <Menu size={32} />}
          </OrgIconButton>
        </div>
        <div className='flex flex-col gap-y-10 h-full w-full items-center'>
          <Logo />
          {children({ expanded: expand })}
        </div>
        <div className='flex flex-row justify-center w-full'>
          {expand ? (
            <a
              href={ZEMTRIX_LINK}
              target='_blank'
              className='flex flex-row items-center justify-center w-full flex-wrap gap-x-2 text-[#1A539F]'
            >
              Powered by Zemtrix
              {zemtrixLogo}
            </a>
          ) : (
            <a
              href={ZEMTRIX_LINK}
              target='_blank'
              className='flex flex-col items-center justify-center'
            >
              {zemtrixLogo}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpandableMenu;
