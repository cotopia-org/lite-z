import { VARZ } from "@/const/varz";
import { useAppSelector } from "@/store";
import { LiveKitRoom } from "@livekit/components-react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
export default function LivekitRefactored({ children }: Props) {
  const { token } = useAppSelector((store) => store.livekit);

  //   video={state.permissions.video}
  //   audio
  //   token={token}
  //   serverUrl={VARZ.serverUrl}
  //   options={{
  //     publishDefaults: {
  //       videoEncoding: {
  //         maxBitrate: 1_500_000,
  //         maxFramerate: 30,
  //       },
  //       screenShareEncoding: {
  //         maxBitrate: 3_000_000,
  //         maxFramerate: 60,
  //       },
  //       dtx: true,
  //       videoSimulcastLayers: [
  //         {
  //           width: 640,
  //           height: 360,
  //           resolution: {
  //             width: 1280,
  //             height: 720,
  //             frameRate: 30,
  //           },
  //           encoding: {
  //             maxBitrate: 500_000,
  //             maxFramerate: 20,
  //           },
  //         },
  //         {
  //           width: 320,
  //           height: 180,
  //           resolution: {
  //             width: 1280,
  //             height: 720,
  //             frameRate: 30,
  //           },
  //           encoding: {
  //             maxBitrate: 150_000,
  //             maxFramerate: 15,
  //           },
  //         },
  //       ],
  //     },
  //     videoCaptureDefaults: {
  //       deviceId: "",
  //       facingMode: "user",
  //       resolution: {
  //         width: 94,
  //         height: 94,
  //         frameRate: 30,
  //       },
  //     },

  //     audioCaptureDefaults: {
  //       autoGainControl: true,
  //       deviceId: "",
  //       echoCancellation: true,
  //       noiseSuppression: true,
  //       sampleRate: 100,
  //     },
  //   }}

  return (
    //@ts-ignore
    <LiveKitRoom
      serverUrl={VARZ.serverUrl}
      token={token}
      connect={true}
      video
      audio
    >
      {children}
    </LiveKitRoom>
  );
}
