import { State } from '.';
import { useRef, useState } from 'react';
import { secondsToTime } from './utils';

const emptyBlob = new Blob() || '';
const emptyStream = new MediaStream();
const initialTime = { h: 0, m: 0, s: 0 };

const initState: State & { stream: MediaStream } = {
  time: initialTime,
  seconds: 0,
  recording: false,
  paused: false,
  medianotFound: false,
  audioBlob: emptyBlob,
  audioData: {
    url: '',
    chunks: [],
    blob: emptyBlob,
    duration: initialTime,
  },
  stream: emptyStream,
};

let timer!: any;

let chunks: Blob[] = [];

let mediaRecorder!: MediaRecorder;

type Props = {
  mimeTypeToUseWhenRecording?: string;
};

export default function useRecorder(props?: Props) {
  const [, sF] = useState({});
  const dataRef = useRef(initState);
  const { paused, recording, stream, medianotFound, audioData, time } = dataRef.current;
  const updatState = () => sF({});

  const initRecorder = async () => {
    // @ts-ignore
    navigator.getUserMedia =
      // @ts-ignore
      navigator.getUserMedia ||
      // @ts-ignore
      navigator.msGetUserMedia ||
      // @ts-ignore
      navigator.mozGetUserMedia ||
      // @ts-ignore
      navigator.webkitGetUserMedia;

    if (navigator.mediaDevices) {
      dataRef.current.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (props) {
        const { mimeTypeToUseWhenRecording = '' } = props;
        mediaRecorder = new MediaRecorder(dataRef.current.stream, {
          mimeType: mimeTypeToUseWhenRecording,
        });
      } else {
        mediaRecorder = new MediaRecorder(dataRef.current.stream);
      }
      chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      return true;
    } else {
      dataRef.current = {
        ...dataRef.current,
        medianotFound: true,
      };
      updatState();
      return false;
    }
  };

  const handleAudioPause = () => {
    if (!paused) {
      clearInterval(timer);
      mediaRecorder.pause();
      dataRef.current = {
        ...dataRef.current,
        paused: true,
      };
      updatState();
    }
  };

  const handleAudioStart = () => {
    if (paused) {
      startTimer();
      mediaRecorder.resume();
      dataRef.current = {
        ...dataRef.current,
        paused: false,
      };
      updatState();
    }
  };

  const countDown = () => {
    let seconds = dataRef.current.seconds + 1;
    dataRef.current = {
      ...dataRef.current,
      seconds,
      time: secondsToTime(seconds),
    };
    updatState();
  };

  const startTimer = () => {
    timer = setInterval(countDown, 1000);
  };

  const startRecording = async () => {
    if (!recording) {
      const isReady = await initRecorder();
      if (isReady) {
        chunks = [];
        mediaRecorder.start(10);
        startTimer();
        dataRef.current = {
          ...dataRef.current,
          recording: true,
        };
        updatState();
      }
    }
  };

  const stopRecording = () => {
    if (recording) {
      clearInterval(timer);
      mediaRecorder.stop();
      dataRef.current = {
        ...dataRef.current,
        paused: false,
        recording: false,
        seconds: 0,
        time: initialTime,
      };
      saveAudio();
      stream.getTracks().forEach(function (track) {
        if (track.readyState === 'live') {
          track.stop();
        }
      });
      updatState();
    }
  };

  const handleReset = () => {
    if (dataRef.current.recording) {
      stopRecording();
    }
    dataRef.current = {
      ...dataRef.current,
      time: initialTime,
      seconds: 0,
      recording: false,
      medianotFound: false,
      audioBlob: emptyBlob,
      audioData: initState.audioData,
    };
    updatState();
  };

  const saveAudio = () => {
    // convert saved chunks to blob
    const blob = new Blob(chunks, { type: 'audio/*' });
    // generate video url from blob
    const audioURL = window.URL.createObjectURL(blob);
    // append videoURL to list of saved videos for rendering
    dataRef.current = {
      ...dataRef.current,
      audioBlob: blob,
      audioData: {
        blob: blob,
        url: audioURL,
        chunks: chunks,
        duration: dataRef.current.time,
      },
    };
    updatState();
  };

  return {
    time,
    paused,
    recording,
    data: audioData,
    reset: handleReset,
    stop: stopRecording,
    start: startRecording,
    pause: handleAudioPause,
    resume: handleAudioStart,
    hasRecorder: !medianotFound,
  };
}
