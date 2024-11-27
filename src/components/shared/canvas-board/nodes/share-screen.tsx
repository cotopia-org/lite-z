import { memo } from "react";
import ScreenShareCard from "../../room/components/screen-share-card";

function ShareScreen(props: any) {
  const { data } = props;

  return <ScreenShareCard track={data.track} />;
}

export default memo(ShareScreen);
