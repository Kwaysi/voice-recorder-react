import { Component } from 'react';
import useRecorder from './useRecorder';
declare type Action = () => void;
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
export declare type RenderProps = {
    time: Time;
    stop: Action;
    start: Action;
    pause: Action;
    reset: Action;
    resume: Action;
    data: AudioData;
    paused: boolean;
    recording: boolean;
};
declare type MainRecorderProps = {
    [key: string]: any;
};
export { useRecorder };
declare type Props = {
    props?: {
        [key: string]: any;
    };
    handleReset?: (e: State) => void;
    handleAudioStop?: (d: AudioData) => void;
    mimeTypeToUseWhenRecording?: string | null;
    Render: (props: RenderProps & MainRecorderProps) => JSX.Element;
};
export declare type State = {
    time: Time;
    seconds: number;
    audioBlob: Blob;
    recording: boolean;
    pauseRecord: boolean;
    audioData: AudioData;
    medianotFound: boolean;
};
export default class Recorder extends Component<Props, State> {
    private timer;
    private chunks;
    private emptyBlob;
    private mediaRecorder;
    private initialTime;
    constructor(props: Props);
    componentDidMount(): Promise<void>;
    handleAudioPause: () => void;
    handleAudioStart: () => void;
    startTimer(): void;
    countDown(): void;
    secondsToTime(secs: number): {
        h: number;
        m: number;
        s: number;
    };
    startRecording: () => void;
    stopRecording: () => void;
    handleReset: () => void;
    saveAudio(): void;
    render(): JSX.Element;
}
//# sourceMappingURL=index.d.ts.map