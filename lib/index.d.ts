import { Component, MouseEventHandler } from 'react';
export declare type Time = {
    h: number;
    m: number;
    s: number;
};
declare type AudioData = {
    url: string;
    blob: Blob;
    chunks: Blob[];
    duration: Time;
};
declare type Action = MouseEventHandler<HTMLElement>;
export declare type RenderProps = {
    start: Action;
    stop: Action;
    pause: Action;
    resume: Action;
    reset: Action;
};
declare type Props = {
    audioURL: string;
    getTime: (t: Time) => void;
    handleReset: (e: State) => void;
    handleAudioStop: (d: AudioData) => void;
    mimeTypeToUseWhenRecording: string | null;
    Render: (props: RenderProps) => JSX.Element;
};
declare type State = {
    time: Time;
    seconds: number;
    audioBlob: Blob;
    audios: string[];
    recording: boolean;
    pauseRecord: boolean;
    medianotFound: boolean;
};
export default class Recorder extends Component<Props, State> {
    private chunks;
    private timer;
    private mediaRecorder;
    constructor(props: Props);
    componentDidMount(): Promise<void>;
    handleAudioPause: MouseEventHandler<HTMLElement>;
    handleAudioStart: MouseEventHandler<HTMLElement>;
    startTimer(): void;
    countDown(): void;
    secondsToTime(secs: number): {
        h: number;
        m: number;
        s: number;
    };
    startRecording: MouseEventHandler<HTMLElement>;
    stopRecording: MouseEventHandler<HTMLElement>;
    handleReset: MouseEventHandler<HTMLElement>;
    saveAudio(): void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=index.d.ts.map