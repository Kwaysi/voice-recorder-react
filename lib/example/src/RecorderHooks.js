"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lib_1 = require("./lib");
var react_1 = require("react");
// Recorder UI component
function RecorderHooks() {
    var audioRef = (0, react_1.useRef)(null);
    var _a = (0, react_1.useState)(false), hasRecording = _a[0], setHasRecording = _a[1];
    var _b = (0, lib_1.useRecorder)(), time = _b.time, data = _b.data, stop = _b.stop, start = _b.start, pause = _b.pause, paused = _b.paused, resume = _b.resume, recording = _b.recording;
    var togglePlay = function () {
        var _a, _b, _c;
        if ((_a = audioRef.current) === null || _a === void 0 ? void 0 : _a.paused) {
            (_b = audioRef.current) === null || _b === void 0 ? void 0 : _b.play();
        }
        else {
            (_c = audioRef.current) === null || _c === void 0 ? void 0 : _c.pause();
        }
    };
    (0, react_1.useEffect)(function () {
        if (data.url && audioRef.current) {
            audioRef.current.src = data.url;
        }
    }, [data.url]);
    return (React.createElement(React.Fragment, null,
        React.createElement("button", { type: 'button', onClick: function () {
                if (recording) {
                    stop();
                    setHasRecording(true);
                }
                else {
                    start();
                    setHasRecording(false);
                }
            } }, "start/stop"),
        recording && (React.createElement(React.Fragment, null,
            React.createElement("button", { type: 'button', onClick: function () {
                    if (recording) {
                        if (paused)
                            resume();
                        else
                            pause();
                    }
                } }, "pause/resume"),
            React.createElement("p", null,
                time.h,
                ":",
                time.m,
                ":",
                time.s),
            React.createElement("br", null),
            React.createElement("br", null))),
        !recording && hasRecording && (React.createElement("button", { type: 'button', onClick: togglePlay, className: 'mr-4' }, "Play/Pause")),
        React.createElement("audio", { ref: audioRef, hidden: true })));
}
exports.default = RecorderHooks;
//# sourceMappingURL=RecorderHooks.js.map