import React, { Component, MouseEventHandler } from 'react';

export type Time = {
  h: number;
  m: number;
  s: number;
};

type AudioData = {
  url: string;
  blob: Blob;
  chunks: Blob[];
  duration: Time;
};

type Action = MouseEventHandler<HTMLElement>;

export type RenderProps = {
  start: Action;
  stop: Action;
  pause: Action;
  resume: Action;
  reset: Action;
};

type Props = {
  audioURL: string;
  getTime: (t: Time) => void;
  handleReset: (e: State) => void;
  handleAudioStop: (d: AudioData) => void;
  mimeTypeToUseWhenRecording: string | null;
  Render: (props: RenderProps) => JSX.Element;
};

type State = {
  time: Time;
  seconds: number;
  audioBlob: Blob;
  audios: string[];
  recording: boolean;
  pauseRecord: boolean;
  medianotFound: boolean;
};

export default class Recorder extends Component<Props, State> {
  private chunks!: Blob[];
  // @ts-ignore
  private timer!: NodeJS.Timeout;
  private mediaRecorder!: MediaRecorder;

  constructor(props: Props) {
    super(props);
    this.state = {
      time: {
        h: 0,
        m: 0,
        s: 0,
      },
      audios: [],
      seconds: 0,
      recording: false,
      pauseRecord: false,
      medianotFound: false,
      audioBlob: new Blob(),
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
      this.setState({ medianotFound: true });
    }
  }

  handleAudioPause: MouseEventHandler<HTMLElement> = (e) => {
    e.preventDefault();
    clearInterval(this.timer);
    this.mediaRecorder.pause();
    this.setState({ pauseRecord: true });
  };

  handleAudioStart: MouseEventHandler<HTMLElement> = (e) => {
    e.preventDefault();
    this.startTimer();
    this.mediaRecorder.resume();
    this.setState({ pauseRecord: false });
  };

  startTimer() {
    //if (this.timer === 0 && this.state.seconds > 0) {
    this.timer = setInterval(this.countDown, 1000);
    //}
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds + 1;
    this.setState(
      {
        time: this.secondsToTime(seconds),
        seconds: seconds,
      },
      () => this.props.getTime(this.state.time)
    );
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

  startRecording: MouseEventHandler<HTMLElement> = (e) => {
    e.preventDefault();
    // wipe old data chunks
    this.chunks = [];
    // start recorder with 10ms buffer
    this.mediaRecorder.start(10);
    this.startTimer();
    // say that we're recording
    this.setState({ recording: true });
  };

  stopRecording: MouseEventHandler<HTMLElement> = (e) => {
    clearInterval(this.timer);
    this.setState({
      time: {
        h: 0,
        m: 0,
        s: 0,
      },
    });
    e.preventDefault();
    // stop the recorder
    this.mediaRecorder.stop();
    // say that we're not recording
    this.setState({ recording: false, pauseRecord: false });
    // save the video to memory
    this.saveAudio();
  };

  handleReset: MouseEventHandler<HTMLElement> = (e) => {
    if (this.state.recording) {
      this.stopRecording(e);
    }
    this.setState(
      {
        time: {
          h: 0,
          m: 0,
          s: 0,
        },
        seconds: 0,
        audios: [],
        recording: false,
        medianotFound: false,
        audioBlob: new Blob(),
      },
      () => {
        this.props.handleReset(this.state);
      }
    );
  };

  saveAudio() {
    // convert saved chunks to blob
    const blob = new Blob(this.chunks, { type: 'audio/*' });
    // generate video url from blob
    const audioURL = window.URL.createObjectURL(blob);
    // append videoURL to list of saved videos for rendering
    const audios = [audioURL];
    this.setState({ audios, audioBlob: blob });
    this.props.handleAudioStop({
      blob: blob,
      url: audioURL,
      chunks: this.chunks,
      duration: this.state.time,
    });
  }

  render() {
    const Render = this.props.Render;
    const { medianotFound } = this.state;

    return (
      <div className=''>
        {!medianotFound ? (
          <Render
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
