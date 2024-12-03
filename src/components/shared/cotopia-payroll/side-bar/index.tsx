import PayrollSideBarHeader from "./header";
import PayrollSideBarLink from "./links";

export default function PayrollSideBar() {
  return (
    <div className='min-w-80 max-w-80 min-h-screen bg-white'>
      <PayrollSideBarHeader />
      <PayrollSideBarLink />
    </div>
  );
}
