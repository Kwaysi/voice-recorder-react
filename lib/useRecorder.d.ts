declare type Props = {
    mimeTypeToUseWhenRecording: string | null;
};
export default function useRecorder({ mimeTypeToUseWhenRecording }: Props): {
    time: import(".").Time;
    reset: () => void;
    stop: () => void;
    data: import(".").AudioData;
    start: () => void;
    pause: () => void;
    resume: () => void;
};
export {};
//# sourceMappingURL=useRecorder.d.ts.map