"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var emptyBlob = new Blob() || '';
var initialTime = { h: 0, m: 0, s: 0 };
var initState = {
    time: initialTime,
    seconds: 0,
    recording: false,
    pauseRecord: false,
    medianotFound: false,
    audioBlob: emptyBlob,
    audioData: {
        url: '',
        chunks: [],
        blob: emptyBlob,
        duration: initialTime,
    },
};
var timer;
var chunks = [];
var mediaRecorder;
function useRecorder(props) {
    var _a = (0, react_1.useState)({}), sF = _a[1];
    var dataRef = (0, react_1.useRef)(initState);
    var updatState = function () { return sF({}); };
    (0, react_1.useEffect)(function () {
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
            navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
                if (props) {
                    var _a = props.mimeTypeToUseWhenRecording, mimeTypeToUseWhenRecording = _a === void 0 ? '' : _a;
                    mediaRecorder = new MediaRecorder(stream, {
                        mimeType: mimeTypeToUseWhenRecording,
                    });
                }
                else {
                    mediaRecorder = new MediaRecorder(stream);
                }
                chunks = [];
                mediaRecorder.ondataavailable = function (e) {
                    if (e.data && e.data.size > 0) {
                        chunks.push(e.data);
                    }
                };
            });
        }
        else {
            dataRef.current = __assign(__assign({}, dataRef.current), { medianotFound: true });
            updatState();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    var handleAudioPause = function () {
        clearInterval(timer);
        mediaRecorder.pause();
        dataRef.current = __assign(__assign({}, dataRef.current), { pauseRecord: true });
        updatState();
    };
    var handleAudioStart = function () {
        startTimer();
        mediaRecorder.resume();
        dataRef.current = __assign(__assign({}, dataRef.current), { pauseRecord: false });
        updatState();
    };
    var countDown = function () {
        var seconds = dataRef.current.seconds + 1;
        dataRef.current = __assign(__assign({}, dataRef.current), { seconds: seconds, time: secondsToTime(seconds) });
        updatState();
    };
    var secondsToTime = function (secs) {
        var hours = Math.floor(secs / (60 * 60));
        var divisor_for_minutes = secs % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);
        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);
        var obj = {
            h: hours,
            m: minutes,
            s: seconds,
        };
        return obj;
    };
    var startTimer = function () {
        timer = setInterval(countDown, 1000);
    };
    var startRecording = function () {
        chunks = [];
        mediaRecorder.start(10);
        startTimer();
        dataRef.current = __assign(__assign({}, dataRef.current), { recording: true });
        updatState();
    };
    var stopRecording = function () {
        clearInterval(timer);
        mediaRecorder.stop();
        dataRef.current = __assign(__assign({}, dataRef.current), { pauseRecord: false, recording: false, seconds: 0, time: initialTime });
        updatState();
        saveAudio();
    };
    var handleReset = function () {
        if (dataRef.current.recording) {
            stopRecording();
        }
        dataRef.current = __assign(__assign({}, dataRef.current), { time: initialTime, seconds: 0, recording: false, medianotFound: false, audioBlob: emptyBlob, audioData: initState.audioData });
        updatState();
    };
    var saveAudio = function () {
        // convert saved chunks to blob
        var blob = new Blob(chunks, { type: 'audio/*' });
        // generate video url from blob
        var audioURL = window.URL.createObjectURL(blob);
        // append videoURL to list of saved videos for rendering
        dataRef.current = __assign(__assign({}, dataRef.current), { audioBlob: blob, audioData: {
                blob: blob,
                url: audioURL,
                chunks: chunks,
                duration: dataRef.current.time,
            } });
        updatState();
    };
    return {
        reset: handleReset,
        stop: stopRecording,
        start: startRecording,
        pause: handleAudioPause,
        resume: handleAudioStart,
        time: dataRef.current.time,
        data: dataRef.current.audioData,
        paused: dataRef.current.pauseRecord,
        recording: dataRef.current.recording,
    };
}
exports.default = useRecorder;
//# sourceMappingURL=useRecorder.js.map