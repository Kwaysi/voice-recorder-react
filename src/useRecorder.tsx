import { State } from '.';
import { useEffect, useState } from 'react';

const emptyBlob = new Blob() || '';
const initialTime = { h: 0, m: 0, s: 0 };

const initState = {
  time: initialTime,
  audios: [],
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

export default function useRecorder({ mimeTypeToUseWhenRecording }: Props) {
  const [time, setTime] = useState(initialTime);
  const [state, setState] = useState<State>(initState);

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
        if (mimeTypeToUseWhenRecording) {
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
      setState({ ...state, medianotFound: true });
    }
  }, []);

  const handleAudioPause = () => {
    clearInterval(timer);
    mediaRecorder.pause();
    setState({ ...state, pauseRecord: true });
  };

  const handleAudioStart = () => {
    startTimer();
    mediaRecorder.resume();
    setState({ ...state, pauseRecord: false });
  };

  const countDown = () => {
    let seconds = state.seconds + 1;
    setTime(secondsToTime(seconds));
    setState({
      ...state,
      seconds: seconds,
    });
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
    setState({ ...state, recording: true });
  };

  const stopRecording = () => {
    clearInterval(timer);
    setTime(initialTime);
    mediaRecorder.stop();
    setState({ ...state, seconds: 0, recording: false, pauseRecord: false });
    saveAudio();
  };

  const handleReset = () => {
    if (state.recording) {
      stopRecording();
    }
    setTime(initialTime);
    setState({
      ...state,
      seconds: 0,
      recording: false,
      medianotFound: false,
      audioBlob: emptyBlob,
      audioData: initState.audioData,
    });
  };

  const saveAudio = () => {
    // convert saved chunks to blob
    const blob = new Blob(chunks, { type: 'audio/*' });
    // generate video url from blob
    const audioURL = window.URL.createObjectURL(blob);
    // append videoURL to list of saved videos for rendering
    setState({
      ...state,
      audioBlob: blob,
      audioData: {
        blob: blob,
        url: audioURL,
        chunks: chunks,
        duration: time,
      },
    });
  };

  return {
    time: time,
    reset: handleReset,
    stop: stopRecording,
    data: state.audioData,
    start: startRecording,
    pause: handleAudioPause,
    resume: handleAudioStart,
    paused: state.pauseRecord,
    recording: state.recording,
  };
}
