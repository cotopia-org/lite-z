import { getNodePositionFromCenter, getRandomColor } from "@/lib/utils";
import { InvisibleNodeType } from ".";
import CotopiaAvatar from "@/components/shared-ui/c-avatar";
import { useMemo } from "react";
import { useRoomContext } from "@/components/shared/room/room-context";

type Props = {
  node: InvisibleNodeType;
  isMyNode?: boolean;
  avatar?: string;
  onClick?: () => void;
};

const UserNodeNavigator = ({
  node,
  avatar,
  isMyNode = false,
  onClick,
}: Props) => {
  const { workspaceUsers } = useRoomContext();

  let nav_clss = `relative rounded-full z-[2]`;
  let avatar_clss =
    "absolute left-1 top-1 z-[2] text-primary border-primary border cursor-pointer";
  let arrow_clss = "absolute top-1/2 -translate-y-1/2 rotate-[45deg]";

  if (isMyNode) {
    nav_clss += "  w-[48px] h-[48px] ";
    avatar_clss += " w-[40px] h-[40px]";
    arrow_clss += " w-6 h-6  right-[-4.5px]";
  } else {
    nav_clss += "  w-[30px] h-[30px]";
    avatar_clss += " w-[22px] h-[22px]";
    arrow_clss += " w-[15px] h-[15px]  right-[-3.7px]";
  }

  const { itemPositionX, itemPositionY, coverCenter } = node;

  const { degree } = getNodePositionFromCenter(
    { x: coverCenter.x, y: coverCenter.y },
    { x: itemPositionX, y: itemPositionY },
  );

  const user = useMemo(() => {
    return workspaceUsers.find((a) => a.username === node.node.id);
  }, [node.node.id, workspaceUsers]);

  return (
    <>
      <div
        style={{
          transform: `rotate(${-degree}deg)`,
          backgroundColor: getRandomColor(user?.created_at),
        }}
        className={nav_clss}
      >
        {/* arrow content */}
        <div
          style={{
            backgroundColor: getRandomColor(user?.created_at),
          }}
          className={arrow_clss}
        ></div>
        {/* arrow content */}
      </div>
      <CotopiaAvatar
        onClick={onClick}
        src={avatar}
        date={user?.created_at}
        className={avatar_clss}
        title={user?.username ? user.name?.[0] : node.node.id[0]}
      />
    </>
  );
};

export default UserNodeNavigator;
