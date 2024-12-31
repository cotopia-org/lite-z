import React, { useRef, useEffect, useState } from 'react';

type VideoPlayerProps = {
  videoSrc: string; // URL or path to the video file
  freezeState?: boolean; // If true, the video shows only the first frame
  loopMuted?: boolean; // If true, the video loops in muted mode
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoSrc,
  freezeState = false,
  loopMuted = false,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      if (freezeState) {
        // Pause the video and set to the first frame
        video.currentTime = 0;
        video.pause();
      } else if (loopMuted) {
        // Enable looping and muted playback
        video.loop = true;
        video.muted = true;
        if (!isPlaying) {
          video.play();
          setIsPlaying(true);
        }
      }
    }

    return () => {
      if (video) {
        video.pause();
        video.loop = false;
      }
    };
  }, [freezeState, loopMuted, isPlaying]);

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        src={videoSrc}
        style={{ width: '100%', height: 'auto' }}
        controls={!freezeState && !loopMuted} // Hide controls if freezeState or loopMuted is active
      ></video>
    </div>
  );
};

export default VideoPlayer;
