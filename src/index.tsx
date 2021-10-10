import React, { Component } from 'react';
import useRecorder from './useRecorder';
import { secondsToTime } from './utils';

type Action = () => void;

export type Time = {
  h: number;
  m: number;
  s: number;
};

export type AudioData = {
  blob: Blob;
  url: string;
  chunks: Blob[];
  duration: Time;
};

export type RecorderProps = {
  time: Time;
  stop: Action;
  start: Action;
  pause: Action;
  reset: Action;
  resume: Action;
  data: AudioData;
  paused: boolean;
  recording: boolean;
  hasRecorder: boolean;
};

type MainRecorderProps = {
  [key: string]: any;
};

export { useRecorder };

type Props = {
  props?: { [key: string]: any };
  handleReset?: (e: State) => void;
  handleAudioStop?: (d: AudioData) => void;
  mimeTypeToUseWhenRecording?: string | null;
  Render: (props: RecorderProps & MainRecorderProps) => JSX.Element;
};

export type State = {
  time: Time;
  seconds: number;
  audioBlob: Blob;
  paused: boolean;
  recording: boolean;
  audioData: AudioData;
  medianotFound: boolean;
};

export default class Recorder extends Component<Props, State> {
  private timer!: any;
  private chunks!: Blob[];
  private stream!: MediaStream;
  private emptyBlob = new Blob();
  private mediaRecorder!: MediaRecorder;
  private initialTime = { h: 0, m: 0, s: 0 };

  constructor(props: Props) {
    super(props);
    this.state = {
      seconds: 0,
      recording: false,
      paused: false,
      medianotFound: false,
      time: this.initialTime,
      audioBlob: this.emptyBlob,
      audioData: {
        url: '',
        chunks: [],
        blob: this.emptyBlob,
        duration: this.initialTime,
      },
    };

    // this.timer = 0;
    this.countDown = this.countDown.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    this.startRecording = this.startRecording.bind(this);
    this.handleAudioPause = this.handleAudioPause.bind(this);
    this.handleAudioStart = this.handleAudioStart.bind(this);
  }

  async initRecorder() {
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
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (this.props.mimeTypeToUseWhenRecording) {
        this.mediaRecorder = new MediaRecorder(this.stream, {
          mimeType: this.props.mimeTypeToUseWhenRecording,
        });
      } else {
        this.mediaRecorder = new MediaRecorder(this.stream);
      }
      this.chunks = [];
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          this.chunks.push(e.data);
        }
      };
      return true;
    } else {
      this.setState({ medianotFound: true });
      return false;
    }
  }

  handleAudioPause = () => {
    if (!this.state.paused) {
      clearInterval(this.timer);
      this.mediaRecorder.pause();
      this.setState({ paused: true });
    }
  };

  handleAudioStart = () => {
    if (this.state.paused) {
      this.startTimer();
      this.mediaRecorder.resume();
      this.setState({ paused: false });
    }
  };

  startTimer() {
    this.timer = setInterval(this.countDown, 1000);
  }

  countDown() {
    let seconds = this.state.seconds + 1;
    this.setState({
      seconds: seconds,
      time: secondsToTime(seconds),
    });
  }

  async startRecording() {
    if (!this.state.recording) {
      const isReady = await this.initRecorder();
      if (isReady) {
        // wipe old data chunks
        this.chunks = [];
        // start recorder with 10ms buffer
        this.mediaRecorder.start(10);
        this.startTimer();
        this.setState({ recording: true });
      }
    }
  }

  stopRecording = () => {
    if (this.state.recording) {
      clearInterval(this.timer);
      this.mediaRecorder.stop();
      this.setState({
        seconds: 0,
        recording: false,
        paused: false,
        time: this.initialTime,
      });
      this.saveAudio();
      this.stream.getTracks().forEach(function (track) {
        if (track.readyState === 'live') {
          track.stop();
        }
      });
    }
  };

  handleReset = () => {
    if (this.state.recording) {
      this.stopRecording();
    }
    this.setState(
      {
        seconds: 0,
        recording: false,
        medianotFound: false,
        time: this.initialTime,
        audioBlob: this.emptyBlob,
      },
      () => {
        this.props.handleReset && this.props.handleReset(this.state);
      }
    );
  };

  saveAudio() {
    const blob = new Blob(this.chunks, { type: 'audio/*' });
    const audioURL = window.URL.createObjectURL(blob);
    this.setState({
      audioData: {
        blob: blob,
        url: audioURL,
        chunks: this.chunks,
        duration: this.state.time,
      },
    });
    if (this.props.handleAudioStop)
      this.props.handleAudioStop({
        blob: blob,
        url: audioURL,
        chunks: this.chunks,
        duration: this.state.time,
      });
  }

  render() {
    const Render = this.props.Render;
    const { medianotFound, time, audioData, recording, paused } = this.state;

    return (
      <div className=''>
        <Render
          time={time}
          data={audioData}
          paused={paused}
          recording={recording}
          {...this.props.props}
          reset={this.handleReset}
          stop={this.stopRecording}
          start={this.startRecording}
          hasRecorder={!medianotFound}
          pause={this.handleAudioPause}
          resume={this.handleAudioStart}
        />
      </div>
    );
  }
}
