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
    audios: [],
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
function useRecorder(_a) {
    var mimeTypeToUseWhenRecording = _a.mimeTypeToUseWhenRecording;
    var _b = (0, react_1.useState)(initialTime), time = _b[0], setTime = _b[1];
    var _c = (0, react_1.useState)(initState), state = _c[0], setState = _c[1];
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
                if (mimeTypeToUseWhenRecording) {
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
            setState(__assign(__assign({}, state), { medianotFound: true }));
        }
    }, []);
    var handleAudioPause = function () {
        clearInterval(timer);
        mediaRecorder.pause();
        setState(__assign(__assign({}, state), { pauseRecord: true }));
    };
    var handleAudioStart = function () {
        startTimer();
        mediaRecorder.resume();
        setState(__assign(__assign({}, state), { pauseRecord: false }));
    };
    var countDown = function () {
        var seconds = state.seconds + 1;
        setTime(secondsToTime(seconds));
        setState(__assign(__assign({}, state), { seconds: seconds }));
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
        setState(__assign(__assign({}, state), { recording: true }));
    };
    var stopRecording = function () {
        clearInterval(timer);
        setTime(initialTime);
        mediaRecorder.stop();
        setState(__assign(__assign({}, state), { seconds: 0, recording: false, pauseRecord: false }));
        saveAudio();
    };
    var handleReset = function () {
        if (state.recording) {
            stopRecording();
        }
        setTime(initialTime);
        setState(__assign(__assign({}, state), { seconds: 0, recording: false, medianotFound: false, audioBlob: emptyBlob, audioData: initState.audioData }));
    };
    var saveAudio = function () {
        // convert saved chunks to blob
        var blob = new Blob(chunks, { type: 'audio/*' });
        // generate video url from blob
        var audioURL = window.URL.createObjectURL(blob);
        // append videoURL to list of saved videos for rendering
        setState(__assign(__assign({}, state), { audioBlob: blob, audioData: {
                blob: blob,
                url: audioURL,
                chunks: chunks,
                duration: time,
            } }));
    };
    return {
        time: time,
        reset: handleReset,
        stop: stopRecording,
        data: state.audioData,
        start: startRecording,
        pause: handleAudioPause,
        resume: handleAudioStart,
        paused: state.pauseRecord,
        recording: state.recording,
    };
}
exports.default = useRecorder;
//# sourceMappingURL=useRecorder.js.map