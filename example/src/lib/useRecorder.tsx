import { State } from '.';
import { useEffect, useRef, useState } from 'react';

const emptyBlob = new Blob() || '';
const initialTime = { h: 0, m: 0, s: 0 };

const initState: State = {
  time: initialTime,
  seconds: 0,
  recording: false,
  pauseRecord: false,
  medianotFound: false,
  audioBlob: emptyBlob,
  audioData: {
    url: '',
    chunks: [],
    blob: emptyBlob,
    duration: initialTime,
  },
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

  const updatState = () => sF({});

  useEffect(() => {
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
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        if (props) {
          const { mimeTypeToUseWhenRecording = '' } = props;
          mediaRecorder = new MediaRecorder(stream, {
            mimeType: mimeTypeToUseWhenRecording,
          });
        } else {
          mediaRecorder = new MediaRecorder(stream);
        }
        chunks = [];
        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            chunks.push(e.data);
          }
        };
      });
    } else {
      dataRef.current = {
        ...dataRef.current,
        medianotFound: true,
      };
      updatState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAudioPause = () => {
    clearInterval(timer);
    mediaRecorder.pause();
    dataRef.current = {
      ...dataRef.current,
      pauseRecord: true,
    };
    updatState();
  };

  const handleAudioStart = () => {
    startTimer();
    mediaRecorder.resume();
    dataRef.current = {
      ...dataRef.current,
      pauseRecord: false,
    };
    updatState();
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

  const secondsToTime = (secs: number) => {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      h: hours,
      m: minutes,
      s: seconds,
    };
    return obj;
  };

  const startTimer = () => {
    timer = setInterval(countDown, 1000);
  };

  const startRecording = () => {
    chunks = [];
    mediaRecorder.start(10);
    startTimer();
    dataRef.current = {
      ...dataRef.current,
      recording: true,
    };
    updatState();
  };

  const stopRecording = () => {
    clearInterval(timer);
    mediaRecorder.stop();
    dataRef.current = {
      ...dataRef.current,
      pauseRecord: false,
      recording: false,
      seconds: 0,
      time: initialTime,
    };
    updatState();
    saveAudio();
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
    reset: handleReset,
    stop: stopRecording,
    start: startRecording,
    pause: handleAudioPause,
    resume: handleAudioStart,
    time: dataRef.current.time,
    data: dataRef.current.audioData,
    paused: dataRef.current.pauseRecord,
    recording: dataRef.current.recording,
  };
}
