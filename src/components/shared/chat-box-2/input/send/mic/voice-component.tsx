import React, { useState, useRef, useEffect } from 'react';
import CotopiaIconButton from '@/components/shared-ui/c-icon-button';
import { Mic } from 'lucide-react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  disabled?: boolean;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  disabled,
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const ffmpegRef = useRef<FFmpeg | null>(null);

  useEffect(() => {
    const loadFFmpeg = async () => {
      const ffmpeg = new FFmpeg();
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.7/dist/umd';

      try {
        await ffmpeg.load({
          coreURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.js`,
            'text/javascript',
          ),
          wasmURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.wasm`,
            'application/wasm',
          ),
        });
        ffmpegRef.current = ffmpeg;
      } catch (err) {
        console.error('Failed to load FFmpeg:', err);
        setError('Failed to load audio conversion tools.');
      }
    };

    loadFFmpeg();

    return () => {
      ffmpegRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    const getMicrophone = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        streamRef.current = stream;
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: 'audio/webm',
          });
          audioChunksRef.current = [];

          if (ffmpegRef.current) {
            const mp3Blob = await convertBlobToMP3(audioBlob);
            onRecordingComplete(mp3Blob);
          } else {
            onRecordingComplete(audioBlob); // Fallback to raw audio
          }
        };
      } catch (err) {
        setError('Microphone access denied or not available.');
        console.error(err);
      }
    };

    getMicrophone();

    // Cleanup on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onRecordingComplete]);

  const convertBlobToMP3 = async (audioBlob: Blob): Promise<Blob> => {
    if (!ffmpegRef.current) {
      console.error('FFmpeg is not initialized.');
      return audioBlob;
    }

    const ffmpeg = ffmpegRef.current;
    const inputFileName = 'input.webm';
    const outputFileName = 'output.mp3';

    try {
      await ffmpeg.writeFile(
        inputFileName,
        new Uint8Array(await audioBlob.arrayBuffer()),
      );

      await ffmpeg.exec(['-i', inputFileName, '-b:a', '128k', outputFileName]);

      const data = await ffmpeg.readFile(outputFileName);

      ffmpeg.unmount(inputFileName);
      ffmpeg.unmount(outputFileName);

      return new Blob([data], { type: 'audio/mpeg' });
    } catch (err) {
      console.error('Error during audio conversion:', err);
      return audioBlob; // Return original blob on error
    }
  };

  const startRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'inactive'
    ) {
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    startRecording();
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    stopRecording();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    startRecording();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    stopRecording();
  };

  return (
    <CotopiaIconButton
      type="button"
      disabled={disabled}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={isRecording ? handleMouseUp : undefined}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`rounded-full flex items-center justify-center text-black/60 transition-all 
          ${isRecording ? '!bg-red-300 text-white !scale-110' : 'bg-transparent'} 
          focus:outline-none active:scale-95 transition-transform`}
    >
      <Mic />
    </CotopiaIconButton>
  );
};

export default VoiceRecorder;
