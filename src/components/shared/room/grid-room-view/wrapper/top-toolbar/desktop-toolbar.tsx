import ToolbarTopRight from '../../../toolbar/top-right';
import TopRightTools from '../../../tools/top-right';
import ToolbarTopLeft from '../../../toolbar/top-left';
import TopLeftTools from '../../../tools/top-left';

interface Props {}

const DesktopToolbar = (props: Props) => {
  return (
    <div className="relative w-full min-h-[80px] hidden md:flex">
      <ToolbarTopRight>
        <TopRightTools />
      </ToolbarTopRight>
      <ToolbarTopLeft>
        <TopLeftTools />
      </ToolbarTopLeft>
    </div>
  );
};

export default DesktopToolbar;
