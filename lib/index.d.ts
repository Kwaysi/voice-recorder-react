import { Component, MouseEventHandler } from 'react';
export declare type Time = {
    h: number;
    m: number;
    s: number;
};
export declare type AudioData = {
    blob: Blob;
    url: string;
    chunks: Blob[];
    duration: Time;
};
declare type Action = MouseEventHandler<HTMLElement>;
export declare type RenderProps = {
    time: Time;
    stop: Action;
    start: Action;
    pause: Action;
    reset: Action;
    resume: Action;
    data: AudioData;
};
declare type Props = {
    handleReset?: (e: State) => void;
    handleAudioStop?: (d: AudioData) => void;
    mimeTypeToUseWhenRecording?: string | null;
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
    audioData: AudioData;
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