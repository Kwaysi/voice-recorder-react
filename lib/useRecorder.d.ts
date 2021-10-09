declare type Props = {
    mimeTypeToUseWhenRecording?: string;
};
export default function useRecorder({ mimeTypeToUseWhenRecording }: Props): {
    time: {
        h: number;
        m: number;
        s: number;
    };
    reset: () => void;
    stop: () => void;
    data: import(".").AudioData;
    start: () => void;
    pause: () => void;
    resume: () => void;
    paused: boolean;
    recording: boolean;
};
export {};
//# sourceMappingURL=useRecorder.d.ts.map