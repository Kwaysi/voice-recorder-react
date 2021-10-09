import React, { Component } from 'react';
import useRecorder from './useRecorder';

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

export { useRecorder };

type Action = () => void;

export type RenderProps = {
  time: Time;
  stop: Action;
  start: Action;
  pause: Action;
  reset: Action;
  resume: Action;
  data: AudioData;
  paused?: boolean;
  recording?: boolean;
  props?: { [key: string]: any };
};

type Props = {
  props?: { [key: string]: any };
  handleReset?: (e: State) => void;
  handleAudioStop?: (d: AudioData) => void;
  mimeTypeToUseWhenRecording?: string | null;
  Render: (props: RenderProps) => JSX.Element;
};

export type State = {
  time: Time;
  seconds: number;
  audioBlob: Blob;
  audios: string[];
  recording: boolean;
  pauseRecord: boolean;
  medianotFound: boolean;
  audioData: AudioData;
};

export default class Recorder extends Component<Props, State> {
  private chunks!: Blob[];
  // @ts-ignore
  private timer!: NodeJS.Timeout;
  private emptyBlob = new Blob();
  private mediaRecorder!: MediaRecorder;
  private initialTime = { h: 0, m: 0, s: 0 };

  constructor(props: Props) {
    super(props);
    this.state = {
      time: this.initialTime,
      audios: [],
      seconds: 0,
      recording: false,
      pauseRecord: false,
      medianotFound: false,
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

  async componentDidMount() {
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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (this.props.mimeTypeToUseWhenRecording) {
        this.mediaRecorder = new MediaRecorder(stream, {
          mimeType: this.props.mimeTypeToUseWhenRecording,
        });
      } else {
        this.mediaRecorder = new MediaRecorder(stream);
      }
      this.chunks = [];
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          this.chunks.push(e.data);
        }
      };
    } else {
      this.setState({ ...this.state, medianotFound: true });
    }
  }

  handleAudioPause = () => {
    clearInterval(this.timer);
    this.mediaRecorder.pause();
    this.setState({ ...this.state, pauseRecord: true });
  };

  handleAudioStart = () => {
    this.startTimer();
    this.mediaRecorder.resume();
    this.setState({ ...this.state, pauseRecord: false });
  };

  startTimer() {
    this.timer = setInterval(this.countDown, 1000);
  }

  countDown() {
    let seconds = this.state.seconds + 1;
    this.setState({
      ...this.state,
      seconds: seconds,
      time: this.secondsToTime(seconds),
    });
  }

  secondsToTime(secs: number) {
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
  }

  startRecording = () => {
    // wipe old data chunks
    this.chunks = [];
    // start recorder with 10ms buffer
    this.mediaRecorder.start(10);
    this.startTimer();
    // say that we're recording
    this.setState({ ...this.state, recording: true });
  };

  stopRecording = () => {
    clearInterval(this.timer);
    this.setState({
      ...this.state,
      seconds: 0,
      time: this.initialTime,
    });
    // stop the recorder
    this.mediaRecorder.stop();
    // say that we're not recording
    this.setState({ ...this.state, recording: false, pauseRecord: false });
    // save the video to memory
    this.saveAudio();
  };

  handleReset = () => {
    if (this.state.recording) {
      this.stopRecording();
    }
    this.setState(
      {
        ...this.state,
        seconds: 0,
        audios: [],
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
    // convert saved chunks to blob
    const blob = new Blob(this.chunks, { type: 'audio/*' });
    // generate video url from blob
    const audioURL = window.URL.createObjectURL(blob);
    this.setState({
      ...this.state,
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
    const { medianotFound, time, audioData, recording, pauseRecord } = this.state;

    return (
      <div className=''>
        {!medianotFound ? (
          <Render
            time={time}
            data={audioData}
            paused={pauseRecord}
            recording={recording}
            {...this.props.props}
            reset={this.handleReset}
            stop={this.stopRecording}
            start={this.startRecording}
            pause={this.handleAudioPause}
            resume={this.handleAudioStart}
          />
        ) : (
          <p style={{ color: '#fff', marginTop: 30, fontSize: 25 }}>Seems the site is Non-SSL</p>
        )}
      </div>
    );
  }
}
