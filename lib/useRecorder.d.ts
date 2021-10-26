declare type Props = {
mimeTypeToUseWhenRecording?: string;
};
export default function useRecorder(props?: Props): {
time: import(".").Time;
paused: boolean;
recording: boolean;
data: import(".").AudioData;
reset: () => void;
stop: () => void;
start: () => Promise<void>;
pause: () => void;
resume: () => void;
hasRecorder: boolean;
};
export {};
//# sourceMappingURL=useRecorder.d.ts.map