import { XYPosition } from "@xyflow/react";

export type updateCoordinatesEvent = {
  coordinates: string;
  room_id: number;
  username: string;
};

export type updateShareScreenCoordinatesEvent = {
  coordinates: XYPosition;
  room_id: number;
  share_screen_id: string;
};

export type LivekitTrackPublishedType = {
  createdAt: string;
  event: string;
  id: string;
  participant: {
    identity: string;
    sid: string;
  };
  room: {
    identity: string;
    sid: string;
  };
  track: {
    codecs: any[];
    height: number;
    layers: any[];
    mid: string;
    mimeType: string;
    sid: string;
    simulcast: boolean;
    source: string;
    stream: string;
    type: string;
    version: { unixMicro: string };
    width: number;
  };
};
