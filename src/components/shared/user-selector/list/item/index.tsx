import CotopiaAvatar from "@/components/shared-ui/c-avatar";
import { getUserFullname } from "@/lib/utils";
import { UserMinimalType, UserType } from "@/types/user";

type Props = {
  item: UserMinimalType | UserType;
  onPick?: (item: UserMinimalType) => void;
  isSelected?: boolean;
  isKeyboardSelected?: boolean;
  env?: "simple" | "detailed";
};

export default function UserCardItem({ item, onPick, isSelected, isKeyboardSelected, env }: Props) {
  const userFullname = getUserFullname(item);
  const username = item?.username;

  let clss = "flex flex-row items-center gap-x-4 px-4 py-2 cursor-pointer";

  if (isSelected || isKeyboardSelected) {
    clss += ` bg-black/[.06] hover:bg-black/[.03]`;
  } else {
    clss += ` hover:bg-black/[.03]`;
  }
  

  //detailed by default
  let content = (
    <>
      <CotopiaAvatar
        src={item.avatar?.url ?? undefined}
        title={userFullname?.[0]}
      />
      <div className='flex items-start flex-col'>
        <strong>{userFullname}</strong>
        <span>{username}</span>
      </div>
    </>
  );

  if (env === "simple")
    content = (
      <>
        <CotopiaAvatar
          src={item.avatar?.url ?? undefined}
          title={userFullname?.[0]}
          className='w-10 h-10'
        />
        <div className='flex items-start flex-col'>
          <strong>{userFullname}</strong>
        </div>
      </>
    );

  return (
    <div onClick={() => onPick && onPick(item as UserMinimalType)} className={clss}>
      {content}
    </div>
  );
}
