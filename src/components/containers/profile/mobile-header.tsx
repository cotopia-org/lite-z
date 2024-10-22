import Logo from "@/components/partials/logo";
import { OrgIconButton } from "@/components/shared-ui";
import { __BUS } from "@/const/bus";
import { Menu } from "lucide-react";
import React, { useState } from "react";
import { dispatch } from "use-bus";

export default function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggleMenu = () => {
    setIsOpen((prev) => {
      const nValue = !prev;

      if (nValue) {
        dispatch(__BUS.openMainSideBar);
      } else {
        dispatch(__BUS.closeMainSideBar);
      }

      return nValue;
    });
  };

  return (
    <header className='flex flex-row md:hidden items-center justify-between bg-white min-h-[56px] px-4 w-full'>
      <OrgIconButton onClick={handleToggleMenu}>
        <Menu />
      </OrgIconButton>
      <Logo />
    </header>
  );
}
