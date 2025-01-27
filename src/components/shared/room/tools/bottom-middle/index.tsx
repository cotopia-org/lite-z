import AddButtonTool from './add-button';
import AfkButtonTool from './afk-button';
import BroadcastButtonTool from './broadcast-button';
import EditButtonTool from './edit-button';
import MegaPhoneButtonTool from './megaphone-button';
import ShareScreenButtonTool from './share-screen-button';
import VideoButtonTool from './video-button';
import VoiceButtonTool from './voice-button';

export default function BottomMiddleTools() {
  return (
    <div className="flex flex-row items-center gap-x-2 bg-white rounded-lg p-[10px] px-5">
      <AddButtonTool />
      <EditButtonTool />
      <ShareScreenButtonTool />
      <BroadcastButtonTool />
      <VideoButtonTool />
      <VoiceButtonTool />
      <AfkButtonTool />
      <MegaPhoneButtonTool />
      {/* <GridViewButtonTool /> */}
    </div>
  );
}
