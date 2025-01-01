import CotopiaIconButton from '@/components/shared-ui/c-icon-button';
import { Pause, Play } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface VoicePlayerProps {
  audioSrc: string;
}

const VoicePlayer: React.FC<VoicePlayerProps> = ({ audioSrc }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;

    setDuration(audioRef.current.duration);
  };

  return (
    <div className="voice-player flex flex-row gap-x-2 w-[160px] max-w-full">
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          if (audioRef?.current) {
            setIsPlaying(false);
            audioRef.current.currentTime = 0;
          }
        }}
      ></audio>
      <CotopiaIconButton className="text-black" onClick={handlePlayPause}>
        {isPlaying ? <Pause /> : <Play />}
      </CotopiaIconButton>
      <div className="flex flex-col items-start">
        <div className="time-info">
          <span>{formatTime(currentTime)}</span>
        </div>
      </div>
    </div>
  );
};

export default VoicePlayer;
