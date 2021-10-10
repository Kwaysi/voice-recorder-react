declare type Props = {
    mimeTypeToUseWhenRecording?: string;
};
export default function useRecorder(props?: Props): {
    reset: () => void;
    stop: () => void;
    start: () => void;
    pause: () => void;
    resume: () => void;
    time: import(".").Time;
    data: import(".").AudioData;
    paused: boolean;
    recording: boolean;
};
export {};
//# sourceMappingURL=useRecorder.d.ts.map