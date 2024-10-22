import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface Props {
  title: string;
  icon: ReactNode;
  href: string;
  expanded: boolean;
}

const MenuItem = ({ href, icon, title, expanded }: Props) => {
  return (
    <NavLink
      //@ts-ignore
      unstable_viewTransition
      end
      to={href}
      className={({ isActive, isPending }) => {
        let clss =
          "min-h-[80px] w-full flex  text-sm font-medium item-center rounded-tl-[50px] rounded-bl-[50px] px-2 whitespace-nowrap";
        if (isPending) clss += " opacity-50";
        if (isActive)
          clss +=
            " text-white bg-primary [&_svg_path]:stroke-white rounded-tl-[50px] ";

        if (!expanded) clss += " justify-center";
        return clss;
      }}
    >
      <div className='flex items-center gap-x-3'>
        {icon}
        {expanded && title}
      </div>
    </NavLink>
  );
};

export default MenuItem;
