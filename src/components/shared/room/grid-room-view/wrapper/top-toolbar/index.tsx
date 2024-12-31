import DesktopToolbar from './desktop-toolbar';
import MobileToolbar from './mobile-toolbar';

interface Props {}

const TopToolbar = (props: Props) => {
  return (
    <>
      <DesktopToolbar />
      <MobileToolbar />
    </>
  );
};

export default TopToolbar;
