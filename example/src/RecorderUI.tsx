import { RecorderProps } from './lib';
import { useEffect, useRef, useState } from 'react';

// Recorder UI component
export default function RecorderUI({
  time,
  stop,
  data,
  start,
  pause,
  resume,
  paused,
  recording,
  hasRecorder,
}: RecorderProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasRecording, setHasRecording] = useState(false);

  const togglePlay = () => {
    if (audioRef.current?.paused) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  };

  useEffect(() => {
    if (data.url && audioRef.current) {
      audioRef.current.src = data.url;
    }
  }, [data.url]);

  return (
    <>
      <button
        type='button'
        onClick={() => {
          if (recording) {
            stop();
            setHasRecording(true);
          } else {
            start();
            setHasRecording(false);
          }
        }}
      >
        start/stop
      </button>

      {recording && (
        <>
          <button
            type='button'
            onClick={() => {
              if (recording) {
                if (paused) resume();
                else pause();
              }
            }}
          >
            pause/resume
          </button>
          <p>
            {time.h}:{time.m}:{time.s}
          </p>
          <br />
          <br />
        </>
      )}

      {!recording && hasRecording && (
        <button type='button' onClick={togglePlay} className='mr-4'>
          Play/Pause
        </button>
      )}

      <audio ref={audioRef} hidden />
    </>
  );
}
