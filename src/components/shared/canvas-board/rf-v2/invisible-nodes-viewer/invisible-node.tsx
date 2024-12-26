import CotopiaAvatar from "@/components/shared-ui/c-avatar";
import { InvisibleNodeType } from ".";
import UserTeleportation from "@/components/shared/user-teleportation";
import { useRoomContext } from "@/components/shared/room/room-context";

const InvisibleNode = ({ node }: { node: InvisibleNodeType }) => {
  const { workspaceUsers } = useRoomContext();

  const {
    node: rfNode,
    invisible_side,
    delta_x,
    delta_y,
    delta_y_prime,
  } = node;

  if (!delta_x || !delta_y) return null;
  let clss = "flex flex-col items-center gap-y-1 absolute z-[2]";
  let style: { [key: string]: any } = {};

  switch (invisible_side) {
    case "right":
      clss += " right-0";
      style["top"] = `${delta_y}px`;

      if (delta_y < 0) {
        style["top"] = `${delta_y}px`;
        clss += " !top-0 !right-0";
      }
      if (delta_y_prime < 0) {
        style["bottom"] = 0;
        style["top"] = "initial";
      }
      break;
    case "left":
      clss += " left-0";
      style["top"] = `${delta_y}px`;
      if (delta_y < 0) {
        clss += " !top-0 !left-0";
      }
      if (delta_y_prime < 0) {
        style["bottom"] = 0;
        style["top"] = "initial";
      }
      break;
    case "bottom":
      clss += " !bottom-0";
      style["left"] = `${delta_x}px`;
      if (delta_y_prime < 0) {
        clss += " !bottom-0";
      }
      break;
    case "top":
      clss += " top-0";
      style["left"] = `${delta_x}px`;
      break;
  }

  const user = workspaceUsers.filter((user) => user.username === rfNode.id)[0];
  if (user === undefined) return null;
  return (
    <div style={style} className={clss}>
      <span className="font-medium text-xs italic">{rfNode.id}</span>
      <UserTeleportation
        username={rfNode.id}
        trigger={(navigateHandler) => {
          return (
            <CotopiaAvatar
              onClick={() => navigateHandler()}
              date={user.created_at}
              src={user.avatar?.url}
              className="w-7 h-7 [&_.avatar-fallback]:bg-blue-300 text-primary border-primary border cursor-pointer"
              title={rfNode.id[0] ?? ""}
            />
          );
        }}
      />
    </div>
  );
};

export default InvisibleNode;
