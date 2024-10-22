import { Outlet } from "react-router-dom";
import ProfileSidebar from "./sidebar";
import MobileHeader from "./mobile-header";

interface Props {}

const ProfileWrapper = (props: Props) => {
  return (
    <div className='flex gap-x-2 min-h-screen bg-foreground'>
      <ProfileSidebar />
      <div className='flex flex-col gap-y-4 w-full'>
        <MobileHeader />
        <div className='w-full py-8 px-6 transition-all duration-300 ease-in-out'>
          <div className='shadow-lg p-4 bg-white h-full rounded-lg'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileWrapper;
