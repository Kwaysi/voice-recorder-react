# Voice Recoder React

React component for recording audio in browser

Inspired by https://github.com/sivaprakashDesingu/react-voice-recorder

This component decouple the UI from the recording functionality.

# Demo

https://codesandbox.io/s/prod-star-sxndo

# Usage

This component can be used as hooks or render props

## Hooks Usage

Hooks still a bit buggy though.

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

# Recoder component

The package exposes a Recorder component that has a Render prop which accepts a Component and passes
`start, stop, pause, resume, reset, time &, data` as props to the component.

```
import { useRef, useState } from 'react';
import Recorder, { RenderProps } from  'voice-recorder-react';

export default function App () {
  return <>
    <Recorder Render={RecorderUI} />
  </>
}

// Recorder UI component

function RecorderUI({ start, stop, pause, resume, time, data }: RenderProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isRecording, setRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);

  const startRecording = () => {
    setRecording(true);
    start();
  };

  const stopRecording = () => {
    setRecording(false);
    stop();
    setHasRecording(true);
  };

  const togglePlay = () => {
    if (audioRef.current?.paused) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  };

  return (
    <>
      <button type='button' onClick={() => (isRecording ? stopRecording() : startRecording())}>
        start/stop
      </button>
      <button type='button' onClick={() => (isRecording ? pause() : resume())}>
        pause/resume
      </button>

      {isRecording && (
        <p>
          {time.h}:{time.m}:{time.s}
        </p>
      )}

      {!isRecording && hasRecording && (
        <button type='button' onClick={togglePlay} className='mr-4'>
          Play/Pause
        </button>
      )}

      <audio ref={audioRef} controls />
    </>
  );
}
```
