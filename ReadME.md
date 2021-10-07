# Voice Recoder React

React component for recording audio in browser

Inspired by https://github.com/sivaprakashDesingu/react-voice-recorder

This component decouple the UI from the recording functionality.

# Demo 

https://codesandbox.io/s/prod-star-sxndo

# Usage

This component can be used as hooks or render props

## Hooks Usage

```
import { useState, useRef } from "react";
import { useRecorder } from "voice-recorder-react";

function Recorder() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isRecording, setRecording] = useState(false);
  const { start, stop, pause, resume, reset, time, data } = useRecorder({
    mimeTypeToUseWhenRecording: null
  });

  const startRecording = () => {
    setRecording(true);
    start();
  };

  const stopRecording = () => {
    stop();
    setRecording(false);
    if (audioRef.current) audioRef.current.src = data.url;
  };

  return (
    <>
      <button
        type="button"
        onClick={() => (isRecording ? stopRecording() : startRecording())}
      >
        start/stop
      </button>
      <button type="button" onClick={() => (isRecording ? pause() : resume())}>
        pause/resume
      </button>

      {isRecording && (
        <p>
          {time.h}:{time.m}:{time.s}
        </p>
      )}

      <audio ref={audioRef} controls />
    </>
  );
}

export default Recorder;

```
