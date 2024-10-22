import {
  ListIcon,
  UsersIcon,
  WalletIcon,
  WarningIcon,
} from "@/components/icons";
import ExpandableMenu from "./expandable-menu";
import MenuItem from "./menu-item";
import LogoutButton from "./logout-button";
import { cn } from "@/lib/utils";

interface Props {}

const ProfileSidebar = (props: Props) => {
  return (
    <ExpandableMenu>
      {({ expanded }) => {
        return (
          <div
            className={cn(
              "flex flex-col items-center pl-3 w-full h-full justify-between"
            )}
          >
            {[
              {
                title: "اطلاعات سازمان",
                icon: <WarningIcon />,
                href: "/profile",
              },
              {
                title: "لیست پرسنل",
                icon: <UsersIcon />,
                href: "/profile/personnel",
              },
              {
                title: "کیف پول سازمان",
                icon: <WalletIcon />,
                href: "/profile/wallet",
              },
              {
                title: "لیست کدهای اعتبار",
                icon: <ListIcon />,
                href: "/profile/credits",
              },
            ].map((item, k) => (
              <MenuItem key={k + 1} expanded={expanded} {...item} />
            ))}
            <LogoutButton justIcon={!!!expanded} />
          </div>
        );
      }}
    </ExpandableMenu>
  );
};

export default ProfileSidebar;
