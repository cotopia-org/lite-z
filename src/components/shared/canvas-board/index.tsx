// Canvas.tsx
import React from 'react';
import WithReactFlowV2 from './rf-v2';
import { CanvasAudioRenderer } from './canvas-audio-rendrer';
import { TracksContextProvider } from '../room/sessions/context';

const Canvas: React.FC = () => {
  return (
    <div id="canvas-board" className="w-full h-[1080px] relative">
      <TracksContextProvider>
        <WithReactFlowV2 />
        <CanvasAudioRenderer />
      </TracksContextProvider>
    </div>
  );
};

export default Canvas;
