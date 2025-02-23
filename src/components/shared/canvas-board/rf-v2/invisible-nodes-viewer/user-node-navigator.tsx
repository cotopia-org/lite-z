import { cn, getNodePositionFromCenter, getRandomColor } from '@/lib/utils';
import { InvisibleNodeType } from '.';
import CotopiaAvatar from '@/components/shared-ui/c-avatar';
import { useMemo } from 'react';
import { useRoomContext } from '@/components/shared/room/room-context';
import { VARZ, colors } from '@/const/varz';

type Props = {
  node: InvisibleNodeType;
  isMyNode?: boolean;
  avatar?: string;
  onClick?: () => void;
};

const SHARE_SCREEN_URL = '/assets/mock/gallery/template/share-screen.png';
const UserNodeNavigator = ({
  node,
  avatar,
  isMyNode = false,
  onClick,
}: Props) => {
  const { workspaceUsers } = useRoomContext();

  const node_type = node?.node?.type;

  const is_share_screen = node_type === VARZ.shareScreenNodeType;

  let nav_clss = `relative rounded-full z-[2]`;
  let avatar_clss =
    'absolute left-1 top-1 z-[2] text-primary border-primary border cursor-pointer';
  let arrow_clss = 'absolute top-1/2 -translate-y-1/2 rotate-[45deg]';

  if (isMyNode || is_share_screen) {
    nav_clss += '  w-[48px] h-[48px] ';
    avatar_clss += ' w-[40px] h-[40px]';
    arrow_clss += ' w-6 h-6  right-[-4.5px]';
  } else {
    nav_clss += '  w-[30px] h-[30px]';
    avatar_clss += ' w-[22px] h-[22px]';
    arrow_clss += ' w-[15px] h-[15px]  right-[-3.7px]';
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
          backgroundColor: is_share_screen
            ? colors.secondary.default
            : getRandomColor(user?.created_at),
        }}
        className={nav_clss}
      >
        {/* arrow content */}
        <div
          style={{
            backgroundColor: is_share_screen
              ? colors.secondary.default
              : getRandomColor(user?.created_at),
          }}
          className={arrow_clss}
        ></div>
        {/* arrow content */}
      </div>

      <CotopiaAvatar
        onClick={onClick}
        src={!!is_share_screen ? SHARE_SCREEN_URL : avatar}
        date={user?.created_at}
        className={avatar_clss}
        title={user?.username ? user.name?.[0] : node.node.id[0]}
      />
    </>
  );
};

export default UserNodeNavigator;
